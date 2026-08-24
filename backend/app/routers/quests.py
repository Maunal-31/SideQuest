from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Quest, User
from app.schemas import QuestCreate, QuestResponse
from app.utils.auth import get_current_user

router = APIRouter(prefix="/quests", tags=["Quest Management"])

def quest_to_response(quest: Quest) -> QuestResponse:
    return QuestResponse(
        id=quest.id,
        title=quest.title,
        description=quest.description,
        category=quest.category,
        locationZone=quest.location_zone,
        lat=quest.lat,
        lng=quest.lng,
        rewardType=quest.reward_type,
        rewardAmount=quest.reward_amount,
        urgency=quest.urgency,
        timeLimitStr=quest.time_limit_str,
        status=quest.status,
        posterName=quest.poster.name if quest.poster else "Anonymous",
        posterLevel=quest.poster.level if quest.poster else 1,
        createdAt=quest.created_at,
        hunterName=quest.hunter.name if quest.hunter else None
    )

@router.get("", response_model=List[QuestResponse])
def get_all_quests(
    category: Optional[str] = Query(None),
    urgency: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    """
    Get all quests with optional filtering by category, urgency, and status.
    """
    query = db.query(Quest)
    if category and category != "All":
        query = query.filter(Quest.category == category)
    if urgency:
        query = query.filter(Quest.urgency == urgency)
    if status_filter:
        query = query.filter(Quest.status == status_filter)
        
    quests = query.order_by(Quest.created_at.desc()).all()
    return [quest_to_response(q) for q in quests]

@router.post("", response_model=QuestResponse, status_code=status.HTTP_201_CREATED)
def create_new_quest(
    quest_in: QuestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Create a new bounty quest (requires authenticated campus user).
    """
    new_quest = Quest(
        title=quest_in.title,
        description=quest_in.description,
        category=quest_in.category,
        location_zone=quest_in.locationZone,
        lat=quest_in.lat,
        lng=quest_in.lng,
        reward_type=quest_in.rewardType,
        reward_amount=quest_in.rewardAmount,
        urgency=quest_in.urgency,
        time_limit_str=quest_in.timeLimitStr,
        status="Open",
        poster_id=current_user.id
    )
    db.add(new_quest)
    db.commit()
    db.refresh(new_quest)
    return quest_to_response(new_quest)

@router.post("/{quest_id}/accept", response_model=QuestResponse)
def accept_quest(
    quest_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Accept an open quest (requires authenticated campus hunter).
    """
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quest not found")
        
    if quest.status != "Open":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail=f"Quest cannot be accepted because it is currently '{quest.status}'"
        )
        
    if quest.poster_id == current_user.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, 
            detail="You cannot accept your own posted quest."
        )

    quest.status = "In Progress"
    quest.hunter_id = current_user.id
    db.commit()
    db.refresh(quest)
    return quest_to_response(quest)

@router.post("/{quest_id}/status", response_model=QuestResponse)
def update_quest_status(
    quest_id: str,
    new_status: str = Query(..., pattern="^(Submitted|Verified & Released|Open|In Progress)$"),
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Update quest status (Submitted, Verified & Released).
    """
    quest = db.query(Quest).filter(Quest.id == quest_id).first()
    if not quest:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Quest not found")

    quest.status = new_status
    if new_status == "Verified & Released" and quest.hunter:
        # Award XP / level up hunter
        quest.hunter.xp += 100
        quest.hunter.coins += quest.reward_amount if quest.reward_type == "Coins" else 0

    db.commit()
    db.refresh(quest)
    return quest_to_response(quest)
