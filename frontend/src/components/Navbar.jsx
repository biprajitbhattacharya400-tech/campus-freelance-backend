import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  Camera,
  ImagePlus,
  LayoutDashboard,
  LayoutList,
  LoaderCircle,
  LogIn,
  LogOut,
  MapPin,
  Menu,
  Moon,
  Pencil,
  PencilLine,
  PlusCircle,
  School,
  SunMedium,
  UserCircle2,
  UserPlus,
  X,
} from 'lucide-react';
import { toast } from 'react-toastify';

import zyloSignature from '../assets/zylo-signature.svg';
import { AuthContext } from '../context/AuthContext';
import { ThemeContext } from '../context/ThemeContext';
import { updateUserProfile, updateUserRole, uploadUserAvatar } from '../services/api';
import { removeToken } from '../utils/auth';

const createProfileForm = (user) => ({
  name: user?.name || '',
  headline: user?.headline || '',
  bio: user?.bio || '',
  avatar_url: user?.avatar_url || '',
  university: user?.university || '',
  location: user?.location || '',
  is_freelancer: Boolean(user?.is_freelancer),
  is_client: user?.is_client !== false,
});

const getRoleLabel = (value) => {
  const roles = [];
  if (value?.is_freelancer) roles.push('Freelancer');
  if (value?.is_client) roles.push('Client');
  return roles.join(' | ') || 'No role selected';
};

const getInitials = (name) =>
  name
    ?.split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('') || 'U';

const resolveAvatarSrc = (avatarUrl) => {
  if (!avatarUrl) return '';
  return avatarUrl;
};

const describeRoles = (user) => {
  const roles = [];
  if (user?.is_freelancer) roles.push('Freelancer');
  if (user?.is_client) roles.push('Client');
  return roles.join(' • ') || 'No role selected';
};

const CameraCaptureModal = ({ open, onClose, onCapture }) => {
  const [starting, setStarting] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    const startCamera = async () => {
      if (!open) return;

      if (!navigator.mediaDevices?.getUserMedia) {
        setError('Camera access is not supported on this device.');
        return;
      }

      setStarting(true);
      setError('');

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'user' },
          audio: false,
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch (_error) {
        setError('Unable to access the camera. Check permission settings and try again.');
      } finally {
        setStarting(false);
      }
    };

    startCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
    };
  }, [open]);

  const handleClose = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setError('');
    onClose();
  };

  const handleCapture = async () => {
    const video = videoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) {
      toast.error('Camera is not ready yet');
      return;
    }

    setCapturing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      canvas.getContext('2d')?.drawImage(video, 0, 0, canvas.width, canvas.height);

      const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.92));
      if (!blob) {
        toast.error('Failed to capture image');
        return;
      }

      const file = new File([blob], `avatar-${Date.now()}.jpg`, { type: 'image/jpeg' });
      await onCapture(file);
      handleClose();
    } finally {
      setCapturing(false);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-slate-950/45 backdrop-blur-[3px]"
            onClick={handleClose}
          />

          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.98 }}
            className="glass-modal fixed inset-x-4 bottom-4 z-[80] mx-auto w-[min(32rem,calc(100vw-2rem))] rounded-[28px]"
          >
            <div className="flex items-center justify-between gap-4">
              <div>
                <div className="font-display text-2xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">Take profile photo</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Frame your face and capture when ready.</div>
              </div>
              <button type="button" onClick={handleClose} className="btn-ghost px-3 py-2 text-sm">
                <X size={16} />
              </button>
            </div>

            <div className="mt-5 overflow-hidden rounded-[24px] border border-slate-200 bg-slate-950 dark:border-white/10">
              <div className="relative aspect-[4/5] w-full bg-slate-950 sm:aspect-[16/12]">
                {starting ? (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-white">
                    <LoaderCircle size={28} className="animate-spin text-cyan-200" />
                    <span className="text-sm text-white/70">Opening camera</span>
                  </div>
                ) : null}

                {error ? (
                  <div className="absolute inset-0 flex items-center justify-center px-6 text-center text-sm leading-7 text-white/70">
                    {error}
                  </div>
                ) : (
                  <video ref={videoRef} playsInline muted className="h-full w-full object-cover" />
                )}
              </div>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row">
              <button type="button" onClick={handleClose} className="btn-secondary px-5 py-3">
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCapture}
                disabled={starting || capturing || Boolean(error)}
                className="btn-primary px-5 py-3"
              >
                {capturing ? (
                  <>
                    <LoaderCircle size={18} className="animate-spin" />
                    Capturing
                  </>
                ) : (
                  <>
                    <Camera size={18} />
                    Capture photo
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      ) : null}
    </AnimatePresence>
  );
};

const ProfilePanel = ({ user, onClose, onLogout, onProfileSaved }) => {
  const [formData, setFormData] = useState(() => createProfileForm(user));
  const [saving, setSaving] = useState(false);
  const [roleSaving, setRoleSaving] = useState('');
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [photoActionsOpen, setPhotoActionsOpen] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const fileInputRef = useRef(null);
  const captureInputRef = useRef(null);

  useEffect(() => {
    setFormData(createProfileForm(user));
  }, [user]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleRoleToggle = async (roleKey) => {
    if (roleSaving) return;

    const previousRoles = {
      is_client: formData.is_client,
      is_freelancer: formData.is_freelancer,
    };
    const nextRoles = {
      is_client: roleKey === 'is_client' ? !formData.is_client : formData.is_client,
      is_freelancer: roleKey === 'is_freelancer' ? !formData.is_freelancer : formData.is_freelancer,
    };

    if (!nextRoles.is_client && !nextRoles.is_freelancer) {
      toast.error('Select at least one role');
      return;
    }

    setFormData((current) => ({ ...current, ...nextRoles }));
    setRoleSaving(roleKey);

    try {
      const { data } = await updateUserRole(nextRoles);
      setFormData((current) => ({
        ...current,
        is_client: data.is_client,
        is_freelancer: data.is_freelancer,
      }));
      onProfileSaved(data);
      toast.success('Role updated');
    } catch (error) {
      setFormData((current) => ({ ...current, ...previousRoles }));
      toast.error(error.response?.data?.detail || 'Failed to update role');
    } finally {
      setRoleSaving('');
    }
  };

  const handleAvatarUpload = async (file) => {
    if (!file) return;

    setAvatarUploading(true);
    try {
      const { data } = await uploadUserAvatar(file);
      setFormData((current) => ({ ...current, avatar_url: data.avatar_url || '' }));
      onProfileSaved(data);
      toast.success('Profile photo updated');
      setPhotoActionsOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to upload photo');
    } finally {
      setAvatarUploading(false);
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    await handleAvatarUpload(file);
    event.target.value = '';
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Name is required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name.trim(),
        headline: formData.headline.trim(),
        bio: formData.bio.trim(),
        avatar_url: formData.avatar_url.trim(),
        university: formData.university.trim(),
        location: formData.location.trim(),
      };

      const { data: profileData } = await updateUserProfile(payload);
      onProfileSaved({
        ...profileData,
        is_client: formData.is_client,
        is_freelancer: formData.is_freelancer,
      });
      toast.success('Profile updated');
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const avatarSource = resolveAvatarSrc(formData.avatar_url?.trim() || user?.avatar_url || '');

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 bg-slate-950/35 backdrop-blur-[2px]"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: -14, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -14, scale: 0.98 }}
          transition={{ duration: 0.18 }}
          className="glass-modal fixed right-4 top-[88px] z-[60] w-[min(27rem,calc(100vw-2rem))] rounded-[2rem] sm:right-6 lg:right-8"
          onClick={(event) => event.stopPropagation()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <input
            ref={captureInputRef}
            type="file"
            accept="image/*"
            capture="user"
            className="hidden"
            onChange={handleFileChange}
          />

          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarSource ? (
                  <img
                    src={avatarSource}
                    alt={user.name}
                    className="h-16 w-16 rounded-full border border-slate-200 object-cover shadow-sm dark:border-white/10"
                  />
                ) : (
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[linear-gradient(135deg,#4f46e5,#06b6d4)] text-lg font-semibold text-white shadow-sm">
                    {getInitials(formData.name)}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setPhotoActionsOpen((current) => !current)}
                  className="absolute -bottom-1 -right-1 inline-flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-[0_10px_24px_rgba(15,23,42,0.1)] transition-all hover:scale-[1.02] dark:border-white/10 dark:bg-slate-900 dark:text-slate-200"
                  aria-label="Edit profile photo"
                >
                  {avatarUploading ? <LoaderCircle size={16} className="animate-spin" /> : <Pencil size={16} />}
                </button>

                <AnimatePresence>
                  {photoActionsOpen ? (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.98 }}
                      className="glass-popover absolute left-0 top-[calc(100%+0.75rem)] z-10 w-56 rounded-[20px]"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoActionsOpen(false);
                          setCameraOpen(true);
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                      >
                        <Camera size={16} />
                        Use camera
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoActionsOpen(false);
                          fileInputRef.current?.click();
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                      >
                        <ImagePlus size={16} />
                        Choose from device
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoActionsOpen(false);
                          captureInputRef.current?.click();
                        }}
                        className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-white/5"
                      >
                        <Camera size={16} />
                        Quick mobile capture
                      </button>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div>
                <div className="font-display text-2xl font-semibold tracking-[-0.03em] text-slate-950 dark:text-white">Your profile</div>
                <div className="mt-1 text-sm text-slate-500 dark:text-slate-400">Update the essentials shown around your workspace.</div>
              </div>
            </div>
            <button type="button" onClick={onClose} className="btn-ghost px-3 py-2 text-sm">
              <X size={16} />
            </button>
          </div>

          <div className="mt-5 rounded-[1.4rem] border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-slate-900/80">
            <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400 dark:text-slate-500">Account email</div>
            <div className="mt-2 text-sm font-medium text-slate-700 dark:text-slate-200">{user.email}</div>
          </div>

          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            <div>
              <div className="field-label">How you use ZYLO</div>
              <div className="grid gap-3 sm:grid-cols-2">
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleRoleToggle('is_freelancer')}
                  disabled={Boolean(roleSaving)}
                  className={`rounded-[20px] border px-4 py-4 text-left transition-all duration-300 ease-in-out ${
                    formData.is_freelancer
                      ? 'border-sky-300 bg-sky-50 text-slate-950 shadow-[0_14px_34px_rgba(14,165,233,0.12)] dark:border-sky-400/40 dark:bg-sky-500/10 dark:text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300'
                  } ${roleSaving ? 'cursor-wait' : ''}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Work (Freelancer)</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Apply to active tasks</div>
                    </div>
                    {roleSaving === 'is_freelancer' ? <LoaderCircle size={16} className="animate-spin" /> : null}
                  </div>
                </motion.button>

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleRoleToggle('is_client')}
                  disabled={Boolean(roleSaving)}
                  className={`rounded-[20px] border px-4 py-4 text-left transition-all duration-300 ease-in-out ${
                    formData.is_client
                      ? 'border-indigo-300 bg-indigo-50 text-slate-950 shadow-[0_14px_34px_rgba(79,70,229,0.12)] dark:border-indigo-400/40 dark:bg-indigo-500/10 dark:text-white'
                      : 'border-slate-200 bg-white text-slate-600 hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900/70 dark:text-slate-300'
                  } ${roleSaving ? 'cursor-wait' : ''}`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-sm font-semibold">Hire (Client)</div>
                      <div className="mt-1 text-xs uppercase tracking-[0.22em] text-slate-400 dark:text-slate-500">Post and manage tasks</div>
                    </div>
                    {roleSaving === 'is_client' ? <LoaderCircle size={16} className="animate-spin" /> : null}
                  </div>
                </motion.button>
              </div>
              <div className="mt-2 text-xs text-slate-500 dark:text-slate-400">Current role: {getRoleLabel(formData)}</div>
            </div>

            <div>
              <label className="field-label">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="input-shell"
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <label className="field-label">Headline</label>
              <input
                type="text"
                name="headline"
                value={formData.headline}
                onChange={handleChange}
                className="input-shell"
                placeholder="Frontend developer for clubs and startups"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="field-label">University</label>
                <div className="relative">
                  <School className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="university"
                    value={formData.university}
                    onChange={handleChange}
                    className="input-shell pl-10"
                    placeholder="Campus name"
                  />
                </div>
              </div>
              <div>
                <label className="field-label">Location</label>
                <div className="relative">
                  <MapPin className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    className="input-shell pl-10"
                    placeholder="City, campus, hostel"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="field-label">Bio</label>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                className="textarea-shell min-h-[120px]"
                placeholder="Tell people what you work on, the kinds of tasks you take, or how you like to collaborate."
              />
            </div>

            <div className="flex flex-col gap-3 border-t border-slate-200 pt-4 dark:border-white/10 sm:flex-row">
              <button type="submit" disabled={saving} className="btn-dark px-5 py-3">
                {saving ? (
                  <>
                    <LoaderCircle size={16} className="animate-spin" />
                    Saving
                  </>
                ) : (
                  <>
                    <PencilLine size={16} />
                    Save profile
                  </>
                )}
              </button>
              <button type="button" onClick={onLogout} className="btn-ghost px-5 py-3">
                <LogOut size={16} />
                Sign out
              </button>
            </div>
          </form>
        </motion.div>
      </AnimatePresence>

      <CameraCaptureModal
        open={cameraOpen}
        onClose={() => setCameraOpen(false)}
        onCapture={handleAvatarUpload}
      />
    </>
  );
};

const Navbar = () => {
  const { user, setUser, loading } = useContext(AuthContext);
  const { isDark, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const navItems = useMemo(() => {
    if (user) {
      return [
        { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
        { label: 'My Tasks', path: '/my-tasks', icon: LayoutList },
      ];
    }

    return [
      { label: 'Home', path: '/' },
      { label: 'Features', path: '/#features' },
      { label: 'Workflow', path: '/#workflow' },
    ];
  }, [user]);

  const handleLogout = () => {
    removeToken();
    setUser(null);
    setMenuOpen(false);
    setProfileOpen(false);
    navigate('/');
  };

  const handleProfileSaved = (updatedUser) => {
    setUser(updatedUser);
  };

  const isAnchor = (path) => path.includes('#');
  const isActive = (path) => {
    if (isAnchor(path)) {
      return location.pathname === '/';
    }

    return location.pathname === path;
  };

  return (
    <>
      <header className="glass-nav sticky top-0 z-40">
        <div className="mx-auto flex max-w-[1540px] items-center justify-between gap-4 px-5 py-4 sm:px-7 lg:px-8 xl:px-10">
          <Link to={user ? '/dashboard' : '/'} className="flex items-center gap-3">
            <img
              src={zyloSignature}
              alt="ZYLO"
              className="brand-logo h-8 w-auto transition-transform duration-300 ease-in-out hover:scale-[1.05] sm:h-9"
            />
            <div>
              <div className="font-display text-xl font-semibold tracking-[-0.04em] text-slate-950 dark:text-white">ZYLO</div>
              <div className="text-xs uppercase tracking-[0.28em] text-slate-400 dark:text-slate-500">Freelance OS</div>
            </div>
          </Link>

          <nav
            className="hidden items-center gap-1 rounded-full border p-1.5 shadow-[0_10px_30px_rgba(15,23,42,0.05)] md:flex dark:border-white/10"
            style={{ background: 'var(--nav-pill-bg)', borderColor: 'var(--border-strong)' }}
          >
            {navItems.map((item) =>
              isAnchor(item.path) ? (
                <a key={item.path} href={item.path} className={`nav-pill ${isActive(item.path) ? 'nav-pill-active' : ''}`}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.path} to={item.path} className={`nav-pill ${isActive(item.path) ? 'nav-pill-active' : ''}`}>
                  {item.label}
                </Link>
              ),
            )}
          </nav>

          <div className="hidden items-center gap-3 md:flex">
            <button
              type="button"
              onClick={toggleTheme}
              className="btn-secondary h-11 w-11 rounded-full p-0"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
            </button>

            {!loading && !user ? (
              <>
                <Link to="/login" className="btn-ghost px-4 py-2.5 text-sm">
                  <LogIn size={16} />
                  Log In
                </Link>
                <Link to="/register" className="btn-dark px-4 py-2.5 text-sm">
                  <UserPlus size={16} />
                  Get Started
                </Link>
              </>
            ) : null}

            {!loading && user ? (
              <>
                {user.is_client ? (
                  <Link to="/create-task" className="btn-dark px-4 py-2.5 text-sm">
                    <PlusCircle size={16} />
                    Post Task
                  </Link>
                ) : null}
                <button
                  type="button"
                  onClick={() => setProfileOpen(true)}
                  className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white/[0.88] px-3 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.05)] transition-all duration-300 ease-in-out hover:-translate-y-0.5 hover:scale-[1.02] hover:shadow-[0_16px_40px_rgba(15,23,42,0.08)] dark:border-white/10 dark:bg-slate-900/80"
                >
                  {user.avatar_url ? (
                    <img
                      src={resolveAvatarSrc(user.avatar_url)}
                      alt={user.name}
                      className="h-10 w-10 rounded-full border border-slate-200 object-cover dark:border-white/10"
                    />
                  ) : (
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[linear-gradient(135deg,#4f46e5,#06b6d4)] text-sm font-semibold text-white">
                      {getInitials(user.name)}
                    </div>
                  )}
                  <div className="max-w-[180px] text-left">
                    <div className="truncate text-sm font-semibold text-slate-900 dark:text-white">{user.name}</div>
                    <div className="truncate text-xs text-slate-500 dark:text-slate-400">{user.headline || getRoleLabel(user) || user.email}</div>
                  </div>
                  <UserCircle2 size={18} className="text-slate-400 dark:text-slate-500" />
                </button>
              </>
            ) : null}
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <button
              type="button"
              onClick={toggleTheme}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/[0.85] text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? <SunMedium size={18} /> : <Moon size={18} />}
            </button>
            <button
              type="button"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/[0.85] text-slate-900 shadow-sm dark:border-white/10 dark:bg-slate-900/80 dark:text-white"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.2 }}
              className="border-t border-slate-200/80 bg-white/[0.94] px-4 py-4 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-950/94 md:hidden"
            >
              <div className="mx-auto flex max-w-[1540px] flex-col gap-2">
                <button
                  type="button"
                  onClick={toggleTheme}
                  className="btn-secondary mb-2 justify-center px-4 py-3"
                >
                  {isDark ? <SunMedium size={16} /> : <Moon size={16} />}
                  {isDark ? 'Light mode' : 'Dark mode'}
                </button>

                {navItems.map((item) =>
                  isAnchor(item.path) ? (
                    <a
                      key={item.path}
                      href={item.path}
                      className={`nav-pill justify-start ${isActive(item.path) ? 'nav-pill-active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`nav-pill justify-start ${isActive(item.path) ? 'nav-pill-active' : ''}`}
                      onClick={() => setMenuOpen(false)}
                    >
                      {item.icon ? <item.icon size={16} /> : null}
                      {item.label}
                    </Link>
                  ),
                )}

                {!loading && !user ? (
                  <div className="mt-3 grid gap-2">
                    <Link to="/login" className="btn-ghost px-4 py-3" onClick={() => setMenuOpen(false)}>
                      <LogIn size={16} />
                      Log In
                    </Link>
                    <Link to="/register" className="btn-dark px-4 py-3" onClick={() => setMenuOpen(false)}>
                      <UserPlus size={16} />
                      Get Started
                    </Link>
                  </div>
                ) : null}

                {!loading && user ? (
                  <div className="mt-3 grid gap-2">
                    <button
                      type="button"
                      className="btn-ghost justify-center px-4 py-3"
                      onClick={() => {
                        setMenuOpen(false);
                        setProfileOpen(true);
                      }}
                    >
                      <UserCircle2 size={16} />
                      Open profile
                    </button>
                    {user.is_client ? (
                      <Link to="/create-task" className="btn-dark px-4 py-3" onClick={() => setMenuOpen(false)}>
                        <PlusCircle size={16} />
                        Post Task
                      </Link>
                    ) : null}
                    <button onClick={handleLogout} className="btn-ghost justify-center px-4 py-3">
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                ) : null}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <AnimatePresence>
        {user && profileOpen ? (
          <ProfilePanel
            user={user}
            onClose={() => setProfileOpen(false)}
            onLogout={handleLogout}
            onProfileSaved={handleProfileSaved}
          />
        ) : null}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
