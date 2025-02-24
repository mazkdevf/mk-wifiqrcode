"use client"

import { useState } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Download, RefreshCw } from "lucide-react"
import { ExportModal } from "./export-modal"

export default function QRCodeGenerator() {
  const [ssid, setSSID] = useState("")
  const [password, setPassword] = useState("")
  const [encryption, setEncryption] = useState("WPA3-Personal")
  const [showExportModal, setShowExportModal] = useState(false)

  const qrCodeValue = encryption === "Nothing" ? `WIFI:S:${ssid};;` : `WIFI:T:${encryption};S:${ssid};P:${password};;`

  const handleReset = () => {
    setSSID("")
    setPassword("")
    setEncryption("WPA3-Personal")
  }

  return (
    <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl">
      <Card className="flex-1 p-6 bg-zinc-900 border-zinc-800">
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="ssid">WiFi SSID (2.4 GHz or 5 GHz Dual-Band)</Label>
            <Input
              id="ssid"
              placeholder="Enter WiFi name"
              value={ssid}
              onChange={(e) => setSSID(e.target.value)}
              className="bg-zinc-800 border-zinc-700 text-white"
            />
          </div>
          {encryption !== "Nothing" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter WiFi password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="encryption">Encryption</Label>
            <select
              id="encryption"
              value={encryption}
              onChange={(e) => setEncryption(e.target.value)}
              className="w-full p-2 rounded bg-zinc-800 border border-zinc-700 text-white"
            >
              <option value="WPA3-Personal">WPA3-Personal</option>
              <option value="WPA2/WPA3-Personal">WPA2/WPA3-Personal</option>
              <option value="WPA2-Personal">WPA2-Personal</option>
              <option value="Nothing">Nothing</option>
            </select>
          </div>
        </form>
      </Card>
      <Card className="flex-1 p-6 bg-zinc-900 border-zinc-800 flex flex-col items-center justify-center">
        <div className="qr-code mb-8">
          <QRCodeSVG
            value={qrCodeValue}
            size={200}
            bgColor="transparent"
            fgColor="white"
            level="H"
            includeMargin={false}
          />
        </div>
        <div className="flex gap-4 w-full">
          <Button onClick={() => setShowExportModal(true)} variant={"outline"} className="flex-1">
            <Download className="mr-2 h-4 w-4" /> Export
          </Button>
          <Button onClick={handleReset} variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" /> Reset
          </Button>
        </div>
      </Card>
      <ExportModal
        open={showExportModal}
        onOpenChange={setShowExportModal}
        ssid={ssid}
        password={password}
        encryption={encryption}
        qrCodeValue={qrCodeValue}
      />


    </div>
  )
}

