class StockFlowException(Exception):
    """Base exception"""
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code
        super().__init__(self.message)

class InsufficientStockException(StockFlowException):
    def __init__(self, message="Insufficient stock"):
        super().__init__(message, status_code=400)

class NotFoundException(StockFlowException):
    def __init__(self, message="Resource not found"):
        super().__init__(message, status_code=404)

class DuplicateException(StockFlowException):
    def __init__(self, message="Resource already exists"):
        super().__init__(message, status_code=409)