import random
import time


def generate_id(prefix: str) -> str:
    """Generate a clean timestamp-based unique ID with prefix, e.g. rest-1729000000"""
    timestamp = int(time.time() * 1000)
    rand_suffix = random.randint(10, 99)
    return f"{prefix}-{timestamp}{rand_suffix}"


def generate_order_id() -> str:
    """Generate an order ID matching frontend format, e.g. FG10254"""
    num = random.randint(10000, 99999)
    return f"FG{num}"


def format_currency(amount: float) -> str:
    """Format currency in Indian Rupee format"""
    return f"₹{amount:,.2f}"
