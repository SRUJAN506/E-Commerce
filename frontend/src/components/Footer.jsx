import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Mail, MessageCircle, Phone, Send, ShieldCheck, HelpCircle, RefreshCcw } from 'lucide-react';
import { toast } from 'react-toastify';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email.trim()) {
      toast.success('Thank you for subscribing! 📬');
      setEmail('');
    }
  };

  return (
    <footer className="bg-card border-t border-border pt-16 pb-8 text-foreground/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Core Features Panel */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-12 mb-12 border-b border-border/80">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Secure Payments</h4>
              <p className="text-xs text-muted-foreground">100% SSL protected transactions</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <RefreshCcw size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">30-Day Guarantee</h4>
              <p className="text-xs text-muted-foreground">Easy returns & simple refunds</p>
            </div>
          </div>
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-muted/40 sm:col-span-2 lg:col-span-1">
            <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0">
              <HelpCircle size={20} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">24/7 Assistance</h4>
              <p className="text-xs text-muted-foreground">Dedicated support team online</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          {/* Brand Info */}
          <div className="space-y-4">
            <Link to="/" className="inline-block">
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                ShopVerse
              </span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Your premium e-commerce destination for electronics, clothing, books, sports & more. Discover curated products at unmatched pricing.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <a href="#" className="w-9 h-9 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-all duration-200" aria-label="Website">
                <Globe size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-all duration-200" aria-label="Mail">
                <Mail size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-all duration-200" aria-label="Support">
                <MessageCircle size={18} />
              </a>
              <a href="#" className="w-9 h-9 rounded-xl bg-muted hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-all duration-200" aria-label="Phone">
                <Phone size={18} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 text-foreground">Categories</h3>
            <ul className="space-y-3">
              {[
                { name: 'Electronics', path: '/shop?category=Electronics' },
                { name: 'Clothing', path: '/shop?category=Clothing' },
                { name: 'Books', path: '/shop?category=Books' },
                { name: 'Sports', path: '/shop?category=Sports' },
                { name: 'Home & Kitchen', path: '/shop?category=Home%20%26%20Kitchen' }
              ].map((item) => (
                <li key={item.name}>
                  <Link to={item.path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Account Links */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-5 text-foreground">Support & Info</h3>
            <ul className="space-y-3">
              {[
                ['My Dashboard', '/dashboard'],
                ['Order History', '/orders'],
                ['Wishlist', '/favourites'],
                ['Track Orders', '/dashboard']
              ].map(([label, path]) => (
                <li key={label}>
                  <Link to={path} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider mb-1 text-foreground">Stay Updated</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Subscribe to get notified about special deals, seasonal sales, and product releases.
            </p>
            <form className="flex flex-col sm:flex-row gap-2" onSubmit={handleSubscribe}>
              <input 
                type="email" 
                placeholder="Enter email address" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border border-border text-foreground text-sm rounded-xl px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                required
              />
              <button 
                type="submit" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-primary/25 flex items-center justify-center gap-1.5"
              >
                <Send size={16} /> Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} ShopVerse. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms of Service</a>
          </div>
          
          {/* Payment Methods */}
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="font-semibold">We Accept:</span>
            <span className="bg-muted px-2.5 py-1 rounded-md font-mono font-bold tracking-widest text-[9px] uppercase border border-border">Visa</span>
            <span className="bg-muted px-2.5 py-1 rounded-md font-mono font-bold tracking-widest text-[9px] uppercase border border-border">MC</span>
            <span className="bg-muted px-2.5 py-1 rounded-md font-mono font-bold tracking-widest text-[9px] uppercase border border-border">Amex</span>
            <span className="bg-muted px-2.5 py-1 rounded-md font-mono font-bold tracking-widest text-[9px] uppercase border border-border">PayPal</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
