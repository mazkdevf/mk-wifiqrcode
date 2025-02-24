"use client"

import { useRef, useEffect, useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { QRCodeSVG } from "qrcode.react"
import { Download, FileImage, FileCode } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ExportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  ssid: string
  password: string
  encryption: string
  qrCodeValue: string
}

export function ExportModal({ open, onOpenChange, ssid, password, encryption, qrCodeValue }: ExportModalProps) {
  const [exportType, setExportType] = useState<"qr-only" | "card">("card")
  const [previewUrl, setPreviewUrl] = useState<string>("")
  const qrRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const generateCardPreview = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = 600
    canvas.height = 320

    // Background
    ctx.fillStyle = "#18181B"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Title
    ctx.font = "bold 15px Permanent Marker"
    ctx.fillStyle = "white"
    ctx.fillText("MKAL.FI - Wifi QR-CODE", 40, 50)

    // Network Details
    ctx.font = "16px Permanent Marker"
    ctx.fillStyle = "#94A3B8"
    ctx.fillText("SSID:", 50, 120)
    ctx.fillStyle = "white"
    ctx.fillText(ssid, 50, 145)

    ctx.fillStyle = "#94A3B8"
    ctx.fillText("Encryption:", 50, 180)
    ctx.fillStyle = "white"
    ctx.fillText(encryption, 50, 205)

    if (encryption !== "Nothing") {
      ctx.fillStyle = "#94A3B8"
      ctx.fillText("Password:", 50, 240)
      ctx.fillStyle = "white"
      ctx.fillText(password, 50, 265)
    }

    // QR Code
    const qrCode = qrRef.current?.querySelector("svg")
    if (qrCode) {
      const svgData = new XMLSerializer().serializeToString(qrCode)
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, canvas.width - 280, 40, 240, 240)
        setPreviewUrl(canvas.toDataURL("image/png"))
      }
      img.src = "data:image/svg+xml;base64," + btoa(svgData)
    }
  }

  const generateQRPreview = () => {
    const qrCode = qrRef.current?.querySelector("svg")
    if (qrCode) {
      const svgData = new XMLSerializer().serializeToString(qrCode)
      setPreviewUrl("data:image/svg+xml;base64," + btoa(svgData))
    }
  }

  useEffect(() => {
    if (open) {
      if (exportType === "card") {
        generateCardPreview()
      } else {
        generateQRPreview()
      }
    }
  }, [open, exportType])

  const handleExport = async (format?: "svg" | "png") => {
    if (exportType === "qr-only") {
      const qrCode = qrRef.current?.querySelector("svg")
      if (qrCode) {
        const svgData = new XMLSerializer().serializeToString(qrCode)
        const downloadLink = document.createElement("a")

        if (format === "svg") {
          downloadLink.download = "wifi-qr-code.svg"
          downloadLink.href = "data:image/svg+xml;base64," + btoa(svgData)
        } else {
          // Convert SVG to PNG
          const canvas = document.createElement("canvas")
          canvas.width = 1024 // High resolution
          canvas.height = 1024
          const ctx = canvas.getContext("2d")
          const img = new Image()
          img.onload = () => {
            if (ctx) {
              ctx.drawImage(img, 0, 0, 1024, 1024)
              downloadLink.download = "wifi-qr-code.png"
              downloadLink.href = canvas.toDataURL("image/png")
              downloadLink.click()
            }
          }
          img.src = "data:image/svg+xml;base64," + btoa(svgData)
          return
        }
        downloadLink.click()
      }
    } else {
      const canvas = canvasRef.current
      if (canvas) {
        const downloadLink = document.createElement("a")
        downloadLink.download = "wifi-details.png"
        downloadLink.href = canvas.toDataURL("image/png")
        downloadLink.click()
      }
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] bg-zinc-900 text-white border-zinc-900">
        <DialogHeader>
          <DialogTitle>Export WiFi Details</DialogTitle>
        </DialogHeader>
        <div className="grid gap-6">
          <Tabs defaultValue="card" onValueChange={(value) => setExportType(value as "qr-only" | "card")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card">Card with Details</TabsTrigger>
              <TabsTrigger value="qr-only">QR Code Only</TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Hidden QR code for reference */}
          <div className="preview-qr hidden" ref={qrRef}>
            <QRCodeSVG
              value={qrCodeValue}
              size={240}
              bgColor="transparent"
              fgColor={exportType === "qr-only" ? "white" : "white"}
              level="H"
              includeMargin={false}
            />
          </div>

          {/* Hidden canvas for card generation */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Preview */}
          <div className="relative aspect-[1.875] rounded-lg overflow-hidden bg-zinc-800">
            {previewUrl && (
              <img
                src={previewUrl || ""}
                alt="Export preview for Wifi QR Code"
                className="w-full h-full object-contain"
              />
            )}
          </div>

          {exportType === "qr-only" ? (
            <div className="grid grid-cols-2 gap-4">
              <Button variant={"outline"} onClick={() => handleExport("svg")}>
                <FileCode className="mr-2 h-4 w-4" /> Download SVG
              </Button>
              <Button variant={"outline"} onClick={() => handleExport("png")}>
                <FileImage className="mr-2 h-4 w-4" /> Download PNG
              </Button>
            </div>
          ) : (
            <Button variant={"outline"} onClick={() => handleExport()}>
              <Download className="mr-2 h-4 w-4" /> Download Card
            </Button>
          )}

          <div className="text-center text-sm text-zinc-300 uppercase">
            If you don't see the preview switch between tabs!
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}