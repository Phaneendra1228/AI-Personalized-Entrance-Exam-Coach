"""
Pinecone Vector Search Service.
Gracefully falls back to curated mock data if Pinecone is not configured.
"""
from typing import List
from config import settings
from schemas import ResourceItem

# Curated mock resources by keyword
MOCK_RESOURCES: dict = {
    "algebra": [
        ResourceItem(title="Khan Academy – Algebra", description="Complete algebra course with interactive exercises", url="https://khanacademy.org/math/algebra", resource_type="video", score=0.95),
        ResourceItem(title="Algebra Fundamentals (Math is Fun)", description="Core algebraic concepts explained simply", url="https://mathisfun.com/algebra", resource_type="article", score=0.90),
        ResourceItem(title="PatrickJMT Algebra", description="Hundreds of worked algebra examples", url="https://patrickjmt.com", resource_type="video", score=0.85),
    ],
    "calculus": [
        ResourceItem(title="MIT OpenCourseWare Calculus", description="Full calculus series from MIT professors", url="https://ocw.mit.edu", resource_type="tutorial", score=0.97),
        ResourceItem(title="3Blue1Brown – Essence of Calculus", description="Visual intuition for calculus concepts", url="https://youtube.com/@3blue1brown", resource_type="video", score=0.95),
    ],
    "statistics": [
        ResourceItem(title="StatQuest with Josh Starmer", description="Statistics explained clearly with visuals", url="https://youtube.com/@statquest", resource_type="video", score=0.94),
        ResourceItem(title="Khan Academy Statistics", description="Complete statistics course", url="https://khanacademy.org/math/statistics-probability", resource_type="tutorial", score=0.90),
    ],
    "probability": [
        ResourceItem(title="Introduction to Probability", description="Comprehensive probability theory guide", url="https://probabilitycourse.com", resource_type="article", score=0.92),
        ResourceItem(title="Khan Academy Probability", description="Probability from basics to advanced", url="https://khanacademy.org/math/statistics-probability", resource_type="tutorial", score=0.88),
    ],
    "physics": [
        ResourceItem(title="HyperPhysics", description="Comprehensive physics reference with concept maps", url="http://hyperphysics.phy-astr.gsu.edu", resource_type="article", score=0.93),
        ResourceItem(title="MIT OCW Physics", description="Full physics courses from MIT", url="https://ocw.mit.edu/courses/physics", resource_type="tutorial", score=0.95),
    ],
    "newton": [
        ResourceItem(title="Newton's Laws – Khan Academy", description="Detailed walkthrough of all three Newton's Laws", url="https://khanacademy.org/science/physics/forces-newtons-laws", resource_type="video", score=0.92),
    ],
    "psychology": [
        ResourceItem(title="Crash Course Psychology", description="Engaging video series covering all psychology topics", url="https://youtube.com/playlist?psychology", resource_type="video", score=0.93),
        ResourceItem(title="Simply Psychology", description="Evidence-based psychology articles and studies", url="https://simplypsychology.org", resource_type="article", score=0.90),
    ],
    "history": [
        ResourceItem(title="Crash Course World History", description="Engaging world history series", url="https://youtube.com/@crashcourse", resource_type="video", score=0.92),
        ResourceItem(title="Khan Academy History", description="World history with primary sources", url="https://khanacademy.org/humanities/world-history", resource_type="tutorial", score=0.88),
    ],
    "marketing": [
        ResourceItem(title="HubSpot Academy", description="Free marketing certification courses", url="https://academy.hubspot.com", resource_type="tutorial", score=0.93),
        ResourceItem(title="Google Digital Garage", description="Free digital marketing fundamentals", url="https://learndigital.withgoogle.com", resource_type="tutorial", score=0.90),
    ],
    "law": [
        ResourceItem(title="Cornell Law School LII", description="Free access to US law and legal explanations", url="https://law.cornell.edu", resource_type="article", score=0.95),
        ResourceItem(title="Khan Academy LSAT Prep", description="Legal reasoning and reading comprehension", url="https://khanacademy.org/prep/lsat", resource_type="tutorial", score=0.88),
    ],
    "ecology": [
        ResourceItem(title="Khan Academy Ecology", description="Ecosystems, energy flow, and biodiversity", url="https://khanacademy.org/science/ap-biology/ecology", resource_type="video", score=0.91),
        ResourceItem(title="NOAA Climate Resources", description="Official climate science resources", url="https://noaa.gov/education", resource_type="article", score=0.89),
    ],
    "programming": [
        ResourceItem(title="freeCodeCamp", description="Full-stack web development curriculum", url="https://freecodecamp.org", resource_type="tutorial", score=0.95),
        ResourceItem(title="CS50 Harvard", description="Introduction to Computer Science from Harvard", url="https://cs50.harvard.edu", resource_type="tutorial", score=0.97),
    ],
    "cybersecurity": [
        ResourceItem(title="TryHackMe", description="Hands-on cybersecurity learning platform", url="https://tryhackme.com", resource_type="tutorial", score=0.94),
        ResourceItem(title="OWASP Top 10", description="Official web security vulnerability guide", url="https://owasp.org", resource_type="article", score=0.92),
    ],
}

DEFAULT_RESOURCES = [
    ResourceItem(title="Wikipedia Reference", description="Comprehensive encyclopedia article on the topic", url="https://wikipedia.org", resource_type="article", score=0.75),
    ResourceItem(title="YouTube – Topic Tutorial", description="Video tutorial covering the topic step-by-step", url="https://youtube.com", resource_type="video", score=0.70),
    ResourceItem(title="Khan Academy", description="Free educational content across all subjects", url="https://khanacademy.org", resource_type="tutorial", score=0.68),
]


def _get_mock_resources(topic: str, top_k: int = 5) -> List[ResourceItem]:
    topic_lower = topic.lower()
    for key, resources in MOCK_RESOURCES.items():
        if key in topic_lower or topic_lower in key:
            return resources[:top_k]
    # Partial keyword match
    for key, resources in MOCK_RESOURCES.items():
        words = key.split()
        if any(w in topic_lower for w in words):
            return resources[:top_k]
    return DEFAULT_RESOURCES[:top_k]


def _is_pinecone_configured() -> bool:
    return bool(
        settings.PINECONE_API_KEY
        and settings.PINECONE_API_KEY not in ("", "your_pinecone_api_key_here")
    )


async def retrieve_resources(topic: str, top_k: int = 5) -> List[ResourceItem]:
    """Async retrieval — uses Pinecone if configured, otherwise mock data."""
    if not _is_pinecone_configured():
        return _get_mock_resources(topic, top_k)
    try:
        import asyncio
        from pinecone import Pinecone
        pc = Pinecone(api_key=settings.PINECONE_API_KEY)
        index = pc.Index(settings.PINECONE_INDEX_NAME)

        embed_model = _get_embedding_model()
        if not embed_model:
            return _get_mock_resources(topic, top_k)

        query_emb = await asyncio.to_thread(embed_model.embed_query, topic)
        results = await asyncio.to_thread(
            index.query, vector=query_emb, top_k=top_k, include_metadata=True
        )
        items = []
        for m in results.get("matches", []):
            meta = m.get("metadata", {})
            items.append(ResourceItem(
                title=meta.get("title", "Study Resource"),
                description=meta.get("description", ""),
                url=meta.get("url"),
                resource_type=meta.get("resource_type", "article"),
                score=round(m.get("score", 0.0), 4),
            ))
        return items or _get_mock_resources(topic, top_k)
    except Exception as e:
        print(f"⚠️  Pinecone error: {e} — using mock resources")
        return _get_mock_resources(topic, top_k)


def retrieve_resources_sync(topic: str, top_k: int = 5) -> List[ResourceItem]:
    """Synchronous fallback used by the planner service."""
    return _get_mock_resources(topic, top_k)


def _get_embedding_model():
    try:
        if settings.LLM_PROVIDER == "openai" and settings.OPENAI_API_KEY:
            from langchain_openai import OpenAIEmbeddings
            return OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        elif settings.GEMINI_API_KEY and settings.GEMINI_API_KEY not in ("", "your_gemini_api_key_here"):
            from langchain_google_genai import GoogleGenerativeAIEmbeddings
            return GoogleGenerativeAIEmbeddings(
                model="models/embedding-001",
                google_api_key=settings.GEMINI_API_KEY
            )
    except ImportError:
        pass
    return None
