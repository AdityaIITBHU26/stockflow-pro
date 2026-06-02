import { useEffect } from 'react'
import { Html5QrcodeScanner } from 'html5-qrcode'
import { useNavigate } from 'react-router-dom'
import Modal from '../ui/Modal'

export default function Scanner({ isOpen, onClose }) {
  const navigate = useNavigate()

  useEffect(() => {
    if (!isOpen) return
    const scanner = new Html5QrcodeScanner('reader', {
      fps: 10,
      qrbox: 250,
      rememberLastUsedCamera: true,
    }, false)
    scanner.render(
      (decodedText) => {
        scanner.clear()
        onClose()
        navigate(`/products?search=${decodedText}`)
      },
      (error) => console.log(error)
    )
    return () => scanner.clear()
  }, [isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Scan Barcode / QR Code">
      <div id="reader" style={{ width: '100%' }}></div>
    </Modal>
  )
}
