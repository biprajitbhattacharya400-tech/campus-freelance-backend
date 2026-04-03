from app.models.application import Application

def apply_to_task(db, task_id, user_id):
    application = Application(
        task_id=task_id,
        user_id=user_id
    )

    db.add(application)
    db.commit()
    db.refresh(application)

    return application

