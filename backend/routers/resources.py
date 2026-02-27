"""
Resources router.
Retrieves relevant study materials via Pinecone vector search.
"""
from fastapi import APIRouter
from schemas import ResourcesResponse
from services.pinecone_service import retrieve_resources

router = APIRouter()


@router.get("/{topic}", response_model=ResourcesResponse)
async def get_resources(topic: str, top_k: int = 5):
    """Return top-k relevant study resources for a topic via vector search."""
    resources = await retrieve_resources(topic, top_k=top_k)
    return ResourcesResponse(topic=topic, resources=resources)
