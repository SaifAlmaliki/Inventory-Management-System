import ShaderBackground from "@/components/ui/shader-background";
import { Button } from "@/components/ui/button";
import { Shield, Truck, Store } from "lucide-react";

export default function Home() {
  return (
    <main className="relative min-h-[calc(100vh-64px)] flex items-center justify-center overflow-hidden">
      <ShaderBackground />
      <div className="relative z-10 text-center px-6 py-16">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white drop-shadow">
          Find Quality Car Parts Across Iraq
        </h1>
        <p className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-white/80">
          Browse verified dealers, compare prices, and manage your inventory seamlessly.
        </p>
        <div className="mt-8 flex items-center justify-center gap-3">
          <Button asChild>
            <a href="/marketplace">Explore Marketplace</a>
          </Button>
          <Button variant="outline" asChild>
            <a href="/products">Manage Products</a>
          </Button>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
      <section className="relative z-10 w-full max-w-6xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3">
            <Store className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Verified Dealers</h3>
          </div>
          <p className="mt-2 text-white/80">Work with trusted suppliers across major Iraqi cities.</p>
        </div>
        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3">
            <Truck className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Fast Fulfillment</h3>
          </div>
          <p className="mt-2 text-white/80">Streamlined logistics and order tracking built-in.</p>
        </div>
        <div className="backdrop-blur-sm bg-white/10 border border-white/20 rounded-lg p-6 text-white">
          <div className="flex items-center gap-3">
            <Shield className="w-6 h-6" />
            <h3 className="text-lg font-semibold">Secure Payments</h3>
          </div>
          <p className="mt-2 text-white/80">Protective checkout and dispute resolution support.</p>
        </div>
      </section>
    </main>
  );
}
