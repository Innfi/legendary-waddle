from sqlalchemy.orm import Session
from user.model import User
from user.dto import UserProfile, FavoriteWorkout

def get_profile(db: Session, user: User) -> UserProfile:
    # This is mock data. In the future, this will be fetched from the database.
    favorite_workouts = [
        FavoriteWorkout(name="Push-up", icon="💪"),
        FavoriteWorkout(name="Squat", icon="🦵"),
    ]

    return UserProfile(
        id=str(user.id),
        name="test_user",
        email="test_email@notexist.io",
        # name=user.name,
        # email=user.email,
        avatar_url=None,
        favorite_workouts=favorite_workouts,
        goal="To be healthy",
    )
