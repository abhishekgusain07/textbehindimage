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
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20" style={{ background: `linear-gradient(to bottom right, var(--bg-hero-gradient-from), var(--bg-hero-gradient-via), var(--bg-hero-gradient-to))` }}>
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="w-8 h-8 mr-2" style={{ color: 'var(--text-blue)' }} />
              <span className="font-semibold" style={{ color: 'var(--text-blue)' }}>AI-Powered Design Tool</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight" style={{ color: 'var(--text-primary)' }}>
              Create Stunning
              <span className="block bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, var(--text-blue), var(--text-purple))` }}>
                Text Behind Image
              </span>
              Effects
            </h1>
            
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
              Transform your images with beautiful text layers that appear behind objects. 
              Create professional designs with our intuitive AI-powered editor.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="text-lg px-8 py-4"
                style={{ 
                  background: `linear-gradient(to right, var(--bg-cta-gradient-from), var(--bg-cta-gradient-to))`,
                  color: 'var(--text-white)'
                }}
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
      <section className="py-20" style={{ background: 'var(--bg-secondary)' }}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
              Everything you need to create amazing designs
            </h2>
            <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>
              Our powerful tools make it easy to create professional text behind image effects
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="text-center p-8 border-0 transition-shadow" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--bg-gradient-from)' }}>
                <Image className="w-8 h-8" style={{ color: 'var(--text-blue)' }} />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Smart Background Removal</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Automatically remove backgrounds from your images with AI-powered technology
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 transition-shadow" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--bg-gradient-to)' }}>
                <Type className="w-8 h-8" style={{ color: 'var(--text-purple)' }} />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Advanced Text Tools</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Customize fonts, colors, and effects to create the perfect text placement
              </p>
            </Card>
            
            <Card className="text-center p-8 border-0 transition-shadow" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-lg)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6" style={{ background: 'var(--bg-tertiary)' }}>
                <Palette className="w-8 h-8" style={{ color: 'var(--text-green)' }} />
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>Professional Results</h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Export high-quality images perfect for social media, marketing, and more
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20" style={{ background: `linear-gradient(to right, var(--bg-cta-gradient-from), var(--bg-cta-gradient-to))` }}>
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6" style={{ color: 'var(--text-white)' }}>
            Ready to create your first design?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto" style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
            Join thousands of creators who are already using our platform to create amazing designs
          </p>
          <Button 
            size="lg" 
            variant="secondary"
            className="text-lg px-8 py-4 transition-colors"
            style={{ 
              background: 'var(--bg-card)',
              color: 'var(--text-blue)'
            }}
            onClick={() => navigate("/sign-in")}
          >
            Start Creating Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* Public Projects Gallery */}
      {publicProjects && publicProjects.length > 0 && (
        <section className="py-20" style={{ background: 'var(--bg-tertiary)' }}>
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: 'var(--text-primary)' }}>
              Community Creations
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {publicProjects.slice(0, 6).map((project) => (
                <Card key={project._id} className="overflow-hidden transition-shadow" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-md)' }}>
                  <CardContent className="p-0">
                    <div className="aspect-video flex items-center justify-center" style={{ background: 'var(--bg-accent)' }}>
                      <span style={{ color: 'var(--text-tertiary)' }}>Project Preview</span>
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{project.title}</h3>
                      <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
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
