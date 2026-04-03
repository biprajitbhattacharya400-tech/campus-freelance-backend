from app.models.task import Task

def create_task(db, task_data, user_id):
    task = Task(
        title=task_data.title,
        description=task_data.description,
        budget=task_data.budget,
        owner_id=user_id
    )

    db.add(task)
    db.commit()
    db.refresh(task)

    return task


def get_all_tasks(db):
    return db.query(Task).all()