from sqlalchemy.orm import Session
from app.repositories.customer_repo import CustomerRepository
from app.schemas.customer import CustomerCreate
from app.exceptions import DuplicateException, NotFoundException

class CustomerService:
    def __init__(self, db: Session):
        self.repo = CustomerRepository(db)

    def get_customers(self, **kwargs):
        return self.repo.get_all(**kwargs)

    def get_customer(self, customer_id: int):
        customer = self.repo.get_by_id(customer_id)
        if not customer:
            raise NotFoundException("Customer not found")
        return customer

    def create_customer(self, customer_in: CustomerCreate):
        if self.repo.get_by_email(customer_in.email):
            raise DuplicateException("Email already exists")
        data = customer_in.model_dump()
        return self.repo.create(data)

    def delete_customer(self, customer_id: int):
        customer = self.get_customer(customer_id)
        self.repo.delete(customer)