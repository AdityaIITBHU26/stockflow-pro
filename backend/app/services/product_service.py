from sqlalchemy.orm import Session
from app.repositories.product_repo import ProductRepository
from app.schemas.product import ProductCreate, ProductUpdate
from app.exceptions import DuplicateException, NotFoundException
from app.models.product import Product

class ProductService:
    def __init__(self, db: Session):
        self.repo = ProductRepository(db)

    def get_products(self, **kwargs):
        return self.repo.get_all(**kwargs)

    def get_product(self, product_id: int) -> Product:
        product = self.repo.get_by_id(product_id)
        if not product:
            raise NotFoundException("Product not found")
        return product

    def create_product(self, product_in: ProductCreate) -> Product:
        if self.repo.get_by_sku(product_in.sku):
            raise DuplicateException("SKU already exists")
        data = product_in.model_dump()
        return self.repo.create(data)

    def update_product(self, product_id: int, product_in: ProductUpdate) -> Product:
        product = self.get_product(product_id)
        update_data = product_in.model_dump(exclude_unset=True)
        if 'sku' in update_data and update_data['sku'] != product.sku:
            if self.repo.get_by_sku(update_data['sku']):
                raise DuplicateException("SKU already exists")
        return self.repo.update(product, update_data)

    def delete_product(self, product_id: int):
        product = self.get_product(product_id)
        self.repo.delete(product)