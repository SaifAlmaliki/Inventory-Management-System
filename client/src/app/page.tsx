import ShaderBackground from "@/components/ui/shader-background";
import { Button } from "@/components/ui/button";
import { Shield, Truck, Store, Star, Users, Zap, ArrowRight, CheckCircle, MapPin, Clock, Award } from "lucide-react";
import Image from "next/image";

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <ShaderBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 text-white/90 text-sm mb-6">
              <Award className="w-4 h-4" />
              <span>Trusted by 500+ Dealers</span>
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-bold tracking-tight text-white mb-6">
              Find Quality
              <span className="block bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Car Parts
              </span>
              Across Iraq
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-2xl">
              Connect with verified dealers, compare prices, and manage your inventory with Iraq's most trusted automotive marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
                <a href="/marketplace" className="flex items-center gap-2">
                  Explore Marketplace
                  <ArrowRight className="w-4 h-4" />
                </a>
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
                <a href="/products" className="flex items-center gap-2">
                  Manage Products
                </a>
              </Button>
            </div>
            
            <div className="flex items-center justify-center lg:justify-start gap-8 text-white/70">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="text-sm">500+ Dealers</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="text-sm">15+ Cities</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                <span className="text-sm">4.9/5 Rating</span>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="relative z-10">
              <Image
                src="https://images.unsplash.com/photo-1486262715619-67b85e0b08e3?w=800&h=600&fit=crop&crop=center"
                alt="Car parts marketplace"
                width={800}
                height={600}
                className="rounded-2xl shadow-2xl"
                priority
              />
              <div className="absolute -top-4 -right-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-4">
                <div className="flex items-center gap-2 text-white">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">Live Inventory</span>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl transform rotate-3 scale-105 -z-10"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-white mb-4">Why Choose Our Platform?</h2>
            <p className="text-xl text-white/70 max-w-3xl mx-auto">
              We provide everything you need to succeed in the automotive parts business
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Store className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Verified Dealers</h3>
                <p className="text-white/70 mb-6">Work with trusted suppliers across major Iraqi cities. All dealers are thoroughly vetted for quality and reliability.</p>
                <div className="flex items-center text-blue-400 group-hover:text-blue-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Truck className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Fast Fulfillment</h3>
                <p className="text-white/70 mb-6">Streamlined logistics and order tracking built-in. Get your parts delivered quickly and efficiently.</p>
                <div className="flex items-center text-green-400 group-hover:text-green-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
            
            <div className="group relative">
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-8 hover:bg-white/15 transition-all duration-300 group-hover:scale-105">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">Secure Payments</h3>
                <p className="text-white/70 mb-6">Protective checkout and dispute resolution support. Your transactions are always secure and protected.</p>
                <div className="flex items-center text-purple-400 group-hover:text-purple-300">
                  <span className="text-sm font-medium">Learn more</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-3xl p-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-4xl font-bold text-white mb-2">500+</div>
                <div className="text-white/70">Verified Dealers</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">50K+</div>
                <div className="text-white/70">Parts Available</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">15+</div>
                <div className="text-white/70">Cities Covered</div>
              </div>
              <div>
                <div className="text-4xl font-bold text-white mb-2">99%</div>
                <div className="text-white/70">Customer Satisfaction</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/70 mb-8">
            Join thousands of dealers and customers who trust our platform for their automotive needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0">
              <a href="/sign-up" className="flex items-center gap-2">
                Start Selling Today
                <ArrowRight className="w-4 h-4" />
              </a>
            </Button>
            <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white/10">
              <a href="/marketplace">Browse Parts</a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
