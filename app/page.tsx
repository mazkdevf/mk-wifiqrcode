import QRCodeGenerator from "@/components/qr-code-generator"
import { Card } from "@/components/ui/card"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black p-4 text-white">
      <QRCodeGenerator />
      <Card className="mt-4 w-full max-w-4xl border-zinc-900">
        <div className="p-4 text-center">
          <h4 className="text-lg font-semibold">WiFi QR Code Generator</h4>
          <p className="text-sm text-zinc-300">Made with ❤️ by mkal.fi</p>
        </div>
      </Card>
    </main>
  )
}

