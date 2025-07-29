import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Authenticated, Unauthenticated } from "convex/react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Sparkles, Image, Type, Palette } from "lucide-react";

export function HomePage() {
  const publicProjects = useQuery(api.projects.getPublicProjects);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50 py-20">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 text-blue-600 mr-2" />
              <span className="text-blue-600 font-semibold">AI-Powered Design Tool</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Create Stunning
              <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Text Behind Image
              </span>
              Effects
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              Transform your images with beautiful text layers that appear behind objects. 
              Create professional designs with our intuitive AI-powered editor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={() => navigate("/sign-in")}
              >
                Get Started Free
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-4"
                onClick={() => navigate("/dashboard")}
              >
                View Examples
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Everything you need to create amazing designs
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our powerful tools make it easy to create professional text behind image effects
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Image className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Smart Background Removal</h3>
              <p className="text-gray-600">
                Automatically remove backgrounds from your images with AI-powered technology
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Type className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Advanced Text Tools</h3>
              <p className="text-gray-600">
                Customize fonts, colors, and effects to create the perfect text placement
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Palette className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Professional Results</h3>
              <p className="text-gray-600">
                Export high-quality images perfect for social media, marketing, and more
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to create your first design?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using our platform to create amazing designs
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100"
            onClick={() => navigate("/sign-in")}
          >
            Start Creating Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Public Projects Gallery */}
      {publicProjects && publicProjects.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Community Creations
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {publicProjects.slice(0, 6).map((project) => (
                <Card key={project._id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gray-200 flex items-center justify-center">
                      <span className="text-gray-500">Project Preview</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
                      <p className="text-sm text-gray-600">
                        Created {new Date(project._creationTime).toLocaleDateString()}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
