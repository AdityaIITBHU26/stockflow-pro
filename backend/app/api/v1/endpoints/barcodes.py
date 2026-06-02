from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from app.api.deps import get_db
from app.models.product import Product
import barcode
from barcode.writer import ImageWriter
import qrcode
from io import BytesIO

router = APIRouter()

@router.get("/{product_id}/barcode")
def get_barcode(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    try:
        code = barcode.get("code128", product.sku, writer=ImageWriter())
        buffer = BytesIO()
        code.write(buffer)
        buffer.seek(0)
        return StreamingResponse(buffer, media_type="image/png")
    except Exception:
        raise HTTPException(status_code=400, detail="Barcode generation failed")

@router.get("/{product_id}/qrcode")
def get_qrcode(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    img = qrcode.make(product.sku)
    buf = BytesIO()
    img.save(buf)
    buf.seek(0)
    return StreamingResponse(buf, media_type="image/png")
