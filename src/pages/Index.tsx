
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { PaintBucket, ChevronRight } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <PaintBucket size={28} className="text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Paint Pro</h1>
            </div>
            <nav className="space-x-4">
              <Link to="/" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Home</Link>
              <Link to="/estimator" className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium">Estimator</Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-bold text-gray-900 mb-6 leading-tight">Professional Painting Estimates at Your Fingertips</h2>
            <p className="text-xl text-gray-600 mb-8">Get accurate, transparent pricing for your painting project in minutes with our free estimator tool.</p>
            
            <Link to="/estimator">
              <Button className="inline-flex items-center gap-2 px-6 py-6 text-lg bg-blue-600 hover:bg-blue-700">
                Create Your Estimate <ChevronRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Paint Pro</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">Our estimator tool offers a comprehensive solution to plan your painting project with confidence.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 transition-all duration-200 hover:shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Easy Room Addition</h3>
              <p className="text-gray-600">Add multiple rooms with different specifications to get a complete project estimate.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 transition-all duration-200 hover:shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Detailed Calculations</h3>
              <p className="text-gray-600">Get transparent pricing with a breakdown of every cost factor involved in your project.</p>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 transition-all duration-200 hover:shadow-md">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3">Volume Discounts</h3>
              <p className="text-gray-600">Automatically receive discounts for larger projects to help you save money.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Start Your Painting Project?</h2>
            <p className="text-xl text-gray-600 mb-8">Create a free estimate today and get a clear picture of your painting costs.</p>
            
            <Link to="/estimator">
              <Button className="inline-flex items-center gap-2 px-6 py-6 text-lg bg-blue-600 hover:bg-blue-700">
                Start Free Estimate <ChevronRight size={20} />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <PaintBucket size={24} className="text-blue-600" />
              <span className="text-xl font-bold text-gray-900">Paint Pro</span>
            </div>
            
            <p className="text-gray-600 text-sm">© {new Date().getFullYear()} Paint Pro. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
