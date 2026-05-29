import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlayCircle, Wand2, ClipboardList, User, CheckCircle, Share2, AtSign, HelpCircle } from 'lucide-react';

const LandingPage: React.FC = () => {
  useEffect(() => {
    const observerOptions = { threshold: 0.1 };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, observerOptions);

    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      section.classList.add('transition-all', 'duration-700', 'opacity-0', 'translate-y-10');
      observer.observe(section);
    });

    return () => {
      sections.forEach((section) => observer.unobserve(section));
    };
  }, []);

  return (
    <div className="min-h-screen bg-warm-50 text-charcoal font-body selection:bg-coral-100 selection:text-coral-800">
      {/* TopNavBar */}
      <nav className="w-full top-0 sticky z-50 bg-warm-50/90 backdrop-blur-md">
        <div className="flex justify-between items-center px-8 py-4 max-w-[1200px] mx-auto">
          <div className="flex items-center gap-8">
            <Link to="/" className="font-heading text-2xl font-bold text-coral-400">
              DraftDesk
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-warm-600 hover:text-coral-400 transition-colors font-body text-base">
                Features
              </a>
              <a href="#pricing" className="text-warm-600 hover:text-coral-400 transition-colors font-body text-base">
                Pricing
              </a>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hidden sm:block text-coral-400 font-bold hover:opacity-80 transition-opacity font-body text-base">
              Log in
            </Link>
            <Link
              to="/new"
              className="bg-coral-400 hover:bg-coral-600 text-white px-6 py-2.5 rounded-[10px] font-body text-sm font-semibold transition-all shadow-sm active:scale-95"
            >
              Start creating — it's free
            </Link>
          </div>
        </div>
      </nav>

      <main className="max-w-[1200px] mx-auto px-8">
        {/* Hero Section */}
        <section className="py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
          <div className="flex-1 space-y-8 text-center md:text-left">
            <h1 className="font-heading text-5xl md:text-6xl leading-tight font-bold tracking-tight text-charcoal">
              From idea to upload, <span className="text-coral-400 italic">faster.</span>
            </h1>
            <p className="text-lg text-warm-600 max-w-xl mx-auto md:mx-0">
              The all-in-one workspace designed for solo creators to script, plan, and track content without the overhead of complex project tools.
            </p>
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start">
              <Link
                to="/new"
                className="bg-coral-400 text-white px-8 py-4 rounded-xl font-heading text-xl font-semibold hover:bg-coral-600 transition-all shadow-md active:scale-[0.98]"
              >
                Start creating
              </Link>
              <button className="text-coral-400 hover:bg-coral-50/50 px-6 py-4 rounded-xl font-heading text-xl font-semibold transition-all flex items-center gap-2 group">
                <PlayCircle className="w-6 h-6" />
                See how it works <span className="transition-transform group-hover:translate-x-1">→</span>
              </button>
            </div>
          </div>
          <div className="flex-1 relative w-full">
            <div className="bg-warm-100 p-3 md:p-4 rounded-2xl shadow-2xl border border-warm-200 overflow-hidden">
              <img
                alt="DraftDesk Dashboard Preview"
                className="rounded-lg shadow-inner border border-warm-100 w-full object-cover aspect-video bg-warm-200"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXxF2n890XaHSyn1t8rYvSAh6gQqjOxNTFkJn7bh7OgslR4NvsetLiPNRGHck6Up-f_F9McpYTSoECl50_72dhBk32p2X9lijE8yqKK9ZW9biKWRt5XjUkWLXq4nqLK4SKWe-QPkBdYgBTmvA19XGnUJAAsysNGPpdln_rBYDbHeCvQ76IBPZi6cYHAZmt5R-I3IvVPknKPlEx1npTtifJ17uFssLy_RvcyvwJaPJ9PYhcI5jbhgRUIiDbhEJCedFOjHVRFIBVtLHC"
              />
            </div>
            {/* Floating Decorative Elements */}
            <div className="absolute -top-4 -right-4 bg-amber-light text-charcoal p-3 rounded-lg shadow-lg animate-bounce hidden lg:flex items-center">
              <Wand2 className="text-amber w-5 h-5" />
              <span className="font-body text-sm font-semibold ml-2">AI Scripting Active</span>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20" id="features">
          <div className="text-center mb-16">
            <h2 className="font-heading text-4xl font-bold mb-4 text-charcoal">Focus on creation, not management.</h2>
            <p className="text-base text-warm-600 max-w-2xl mx-auto">
              Everything you need to run your channel or platform from a single, beautiful workspace.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* AI Script Generator */}
            <div className="bg-white p-8 rounded-[12px] border-[1.5px] border-warm-200 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-coral-400">
              <div className="w-16 h-16 bg-warm-100 rounded-xl flex items-center justify-center mb-8 text-coral-400 group-hover:scale-110 transition-transform">
                <Wand2 className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-charcoal">AI Script Generator</h3>
              <p className="text-base text-warm-600 leading-relaxed">
                Beat blank-page syndrome. Turn a 3-word idea into a full video outline or script draft in seconds using built-in creative prompts.
              </p>
            </div>
            {/* Content Tracker */}
            <div className="bg-white p-8 rounded-[12px] border-[1.5px] border-warm-200 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-amber">
              <div className="w-16 h-16 bg-warm-100 rounded-xl flex items-center justify-center mb-8 text-amber group-hover:scale-110 transition-transform">
                <ClipboardList className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-charcoal">Content Tracker</h3>
              <p className="text-base text-warm-600 leading-relaxed">
                Never lose track of a deadline. Manage your production pipeline with an intuitive board designed specifically for creators.
              </p>
            </div>
            {/* Built for Solo Creators */}
            <div className="bg-white p-8 rounded-[12px] border-[1.5px] border-warm-200 shadow-sm hover:shadow-md transition-all group border-b-4 border-b-warm-500">
              <div className="w-16 h-16 bg-warm-100 rounded-xl flex items-center justify-center mb-8 text-warm-500 group-hover:scale-110 transition-transform">
                <User className="w-8 h-8" />
              </div>
              <h3 className="font-heading text-2xl font-bold mb-4 text-charcoal">Built for Solo Creators</h3>
              <p className="text-base text-warm-600 leading-relaxed">
                No team needed. We stripped away the bloat of corporate project management to give you a focused, distraction-free creative studio.
              </p>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-20 bg-warm-100 rounded-3xl px-8 md:px-16 my-10">
          <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1">
              <h2 className="font-heading text-4xl font-bold mb-12 text-charcoal">How it works</h2>
              <div className="space-y-12">
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-coral-400 text-white flex items-center justify-center font-bold">1</div>
                  <div>
                    <h4 className="font-heading text-2xl font-semibold mb-2 text-charcoal">Capture the spark</h4>
                    <p className="text-warm-600">Quickly jot down content ideas on the go with our mobile-first intake form.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-coral-400 text-white flex items-center justify-center font-bold">2</div>
                  <div>
                    <h4 className="font-heading text-2xl font-semibold mb-2 text-charcoal">Draft and Refine</h4>
                    <p className="text-warm-600">Use our integrated editor to script and organize your shots in one place.</p>
                  </div>
                </div>
                <div className="flex gap-6">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-coral-400 text-white flex items-center justify-center font-bold">3</div>
                  <div>
                    <h4 className="font-heading text-2xl font-semibold mb-2 text-charcoal">Execute and Ship</h4>
                    <p className="text-warm-600">Track the editing process and mark as "Uploaded" to see your stats grow.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="aspect-square bg-warm-200 rounded-2xl flex items-center justify-center group overflow-hidden">
                <img
                  alt="Workflow close-up"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0Snzjd4YGtQGg-4qoSe1fiw0zcrtlcHfuuUdPnO3dnFLxCnVg2c0hBax0WAdlvf1ySG8AdKmcjDh3RqS19xd9dppU-iypv31WfuEPSgP6JbfAkcog-SAnyTs6dTXvS3FNoZODAHisdGGxA5Oq8tLqENuGDRnBuTxWSdiwXkkpYi_Q4G1Lob2OMHeSPInX2rGF0UsWtlwRX6LRRCy97eufX8sdma-_USiIk51G4hx_WxiqGGWphJqWiAPh14rz0YdQjCN53Az6BYp7"
                />
              </div>
              <div className="aspect-square bg-warm-200 rounded-2xl flex items-center justify-center mt-12 group overflow-hidden">
                <img
                  alt="Creative planning"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2Rf7HaKxzY0IRjm6vL876Te95rVnDc6VLhqC4uuV3GS66VlYTdcXuibdp9mqLMfekoh1b6OXrJh70AtXs6t2WRsSSjR8Xmtz5aijqsxd9DRp_rxDd6SJ7cOTSdmnTFGxu5IDfEcJVQjapgacNo5czhQbPFYWWsLhoD6_mBVezHdY2P4lMOoiSeYG4hWnEKyCC213IGO_dx9kbGVPGjFRwY2C0H711tYOXEA-Jx56llA9nIHu9N71qoXDxdb6nIM8sW06IkQHUdsr1"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-20" id="pricing">
          <div className="max-w-xl mx-auto bg-white border-2 border-coral-400/20 rounded-[2rem] p-10 md:p-16 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 bg-coral-400 text-white px-8 py-2 rounded-bl-2xl font-body text-xs font-bold uppercase tracking-widest">
              Limited Time
            </div>
            <h2 className="font-heading text-4xl font-bold mb-2 text-charcoal">Beta Access</h2>
            <div className="text-6xl text-coral-400 font-bold my-6 font-heading">
              Free <span className="text-2xl text-warm-600 font-normal">during beta</span>
            </div>
            <ul className="text-left space-y-4 mb-10 max-w-xs mx-auto">
              <li className="flex items-center gap-3">
                <CheckCircle className="text-coral-400 w-6 h-6" />
                <span className="text-base text-charcoal">Unlimited projects &amp; scripts</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-coral-400 w-6 h-6" />
                <span className="text-base text-charcoal">50 AI scripts/month</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-coral-400 w-6 h-6" />
                <span className="text-base text-charcoal">Personal content calendar</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle className="text-coral-400 w-6 h-6" />
                <span className="text-base text-charcoal">Priority support</span>
              </li>
            </ul>
            <Link
              to="/new"
              className="inline-block w-full bg-coral-400 text-white py-5 rounded-2xl font-heading text-xl font-semibold hover:bg-coral-600 transition-all shadow-lg active:scale-[0.98]"
            >
              Start creating — it's free
            </Link>
            <p className="mt-6 text-sm text-warm-600">No credit card required. Lock in your spot today.</p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-charcoal text-warm-300 mt-20 pt-20 pb-10">
        <div className="max-w-[1200px] mx-auto px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
            <div className="col-span-1 md:col-span-2">
              <Link to="/" className="font-heading text-3xl font-bold text-coral-400 mb-6 block">
                DraftDesk
              </Link>
              <p className="text-base text-warm-400 max-w-sm">
                Designed with love for the solo creators who make the internet a more interesting place. From first draft to final upload.
              </p>
            </div>
            <div>
              <h5 className="font-body text-sm font-bold uppercase tracking-wider text-warm-500 mb-6">Product</h5>
              <ul className="space-y-4 text-base">
                <li>
                  <a href="#features" className="hover:text-coral-400 transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="hover:text-coral-400 transition-colors">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-coral-400 transition-colors">
                    Beta Roadmap
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h5 className="font-body text-sm font-bold uppercase tracking-wider text-warm-500 mb-6">Community</h5>
              <ul className="space-y-4 text-base">
                <li>
                  <a href="#" className="hover:text-coral-400 transition-colors flex items-center gap-2">
                    <AtSign className="w-4 h-4" /> X / Twitter
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-coral-400 transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" /> Discord
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-coral-400 transition-colors flex items-center gap-2">
                    <HelpCircle className="w-4 h-4" /> Support
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center pt-10 border-t border-warm-700 gap-6">
            <p className="text-sm">© 2026 DraftDesk. All rights reserved.</p>
            <div className="flex gap-8">
              <a href="#" className="text-sm hover:text-coral-400">
                Privacy Policy
              </a>
              <a href="#" className="text-sm hover:text-coral-400">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
