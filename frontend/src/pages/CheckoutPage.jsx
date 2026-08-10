import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';
import { MapPin, Truck, CreditCard, ClipboardCheck, ArrowLeft, ArrowRight, CheckCircle2, Package, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  { id: 'address', title: 'Address', icon: MapPin },
  { id: 'delivery', title: 'Delivery', icon: Truck },
  { id: 'payment', title: 'Payment', icon: CreditCard },
  { id: 'review', title: 'Review', icon: ClipboardCheck }
];

const CheckoutPage = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  
  // Form State
  const [address, setAddress] = useState({
    firstName: '', lastName: '', street: '', city: '', state: '', zip: '', phone: ''
  });
  const [deliveryMethod, setDeliveryMethod] = useState('standard');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardDetails, setCardDetails] = useState({ number: '', name: '', exp: '', cvc: '' });

  const items = cart?.items || [];
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const gst = subtotal * 0.18;
  const deliveryCost = deliveryMethod === 'express' ? 14.99 : deliveryMethod === 'standard' ? 9.99 : 0;
  const total = subtotal + gst + deliveryCost;

  const handleNext = () => {
    if (currentStep === 0) {
      if (!address.firstName || !address.street || !address.city || !address.zip) {
        toast.error('Please fill in all required address fields');
        return;
      }
    }
    if (currentStep === 2) {
      if (paymentMethod === 'card' && (!cardDetails.number || !cardDetails.name || !cardDetails.exp || !cardDetails.cvc)) {
        toast.error('Please fill in card details');
        return;
      }
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }
    
    try {
      setLoading(true);
      const fullAddress = `${address.street}, ${address.city}, ${address.state} ${address.zip}`;
      await api.post('/orders', { shippingAddress: fullAddress });
      await fetchCart(); // Clears cart
      setOrderComplete(true);
      window.scrollTo(0, 0);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (orderComplete) {
    return (
      <div className="min-h-screen bg-background pt-24 pb-12 flex flex-col items-center justify-center">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-card border border-border p-12 rounded-[2.5rem] text-center shadow-xl max-w-xl mx-4"
        >
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 10, delay: 0.15 }}
            className="w-20 h-20 bg-emerald-100 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={40} />
          </motion.div>
          <h1 className="text-3xl font-extrabold text-foreground mb-4">Order Confirmed!</h1>
          <p className="text-muted-foreground mb-8 text-sm leading-relaxed max-w-sm mx-auto">
            Thank you for shopping at ShopVerse. Your payment is approved and we have begun processing your items. You will receive email tracking shortly.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/orders" 
              className="bg-primary hover:bg-primary/95 text-primary-foreground px-8 py-3.5 rounded-xl font-bold transition-all shadow-md shadow-primary/20"
            >
              Track Order
            </Link>
            <Link 
              to="/shop" 
              className="bg-secondary hover:bg-muted text-foreground border border-border px-8 py-3.5 rounded-xl font-bold transition-all"
            >
              Continue Shopping
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen py-12 text-left">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={() => navigate('/cart')}
            className="w-10 h-10 bg-card border border-border rounded-full flex items-center justify-center text-foreground hover:bg-muted transition-colors focus:outline-none"
            aria-label="Back to Cart"
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground">Checkout</h1>
        </div>

        {/* Modern Stepper */}
        <div className="max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-0.5 bg-border/80 -z-10" />
            {steps.map((step, idx) => {
              const isCompleted = currentStep > idx;
              const isActive = currentStep === idx;
              const Icon = step.icon;
              return (
                <div key={step.id} className="flex flex-col items-center gap-2 bg-background px-3 relative z-10">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center border-2 transition-all ${
                    isActive ? 'border-primary bg-primary text-primary-foreground shadow-md shadow-primary/10' :
                    isCompleted ? 'border-primary bg-primary/10 text-primary' :
                    'border-border bg-card text-muted-foreground'
                  }`}>
                    {isCompleted ? <CheckCircle2 size={18} className="fill-current text-primary" /> : <Icon size={18} />}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${
                    isActive || isCompleted ? 'text-primary' : 'text-muted-foreground'
                  }`}>
                    {step.title}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8">
          
          {/* Main Form Fields */}
          <div className="lg:col-span-8">
            <div className="bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm relative overflow-hidden min-h-[500px]">
              
              <AnimatePresence mode="wait">
                
                {/* STEP 0: ADDRESS */}
                {currentStep === 0 && (
                  <motion.div key="step-0" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
                    <h2 className="text-xl font-bold text-foreground">Shipping Address</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">First Name *</label>
                        <input 
                          type="text" 
                          value={address.firstName} 
                          onChange={e => setAddress({...address, firstName: e.target.value})} 
                          className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-medium" 
                          placeholder="Jane"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Last Name</label>
                        <input 
                          type="text" 
                          value={address.lastName} 
                          onChange={e => setAddress({...address, lastName: e.target.value})} 
                          className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-medium" 
                          placeholder="Doe"
                        />
                      </div>
                      <div className="sm:col-span-2 space-y-1.5 text-left">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Street Address *</label>
                        <input 
                          type="text" 
                          value={address.street} 
                          onChange={e => setAddress({...address, street: e.target.value})} 
                          className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-medium" 
                          placeholder="123 Shopping Avenue"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">City *</label>
                        <input 
                          type="text" 
                          value={address.city} 
                          onChange={e => setAddress({...address, city: e.target.value})} 
                          className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-medium" 
                          placeholder="Silicon Valley"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">State / Province</label>
                        <input 
                          type="text" 
                          value={address.state} 
                          onChange={e => setAddress({...address, state: e.target.value})} 
                          className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-medium" 
                          placeholder="CA"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">ZIP / Postal Code *</label>
                        <input 
                          type="text" 
                          value={address.zip} 
                          onChange={e => setAddress({...address, zip: e.target.value})} 
                          className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-medium" 
                          placeholder="94025"
                        />
                      </div>
                      <div className="space-y-1.5 text-left">
                        <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Phone Number</label>
                        <input 
                          type="tel" 
                          value={address.phone} 
                          onChange={e => setAddress({...address, phone: e.target.value})} 
                          className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-medium" 
                          placeholder="+1 (555) 123-4567"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 1: DELIVERY */}
                {currentStep === 1 && (
                  <motion.div key="step-1" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
                    <h2 className="text-xl font-bold text-foreground">Delivery Method</h2>
                    <div className="space-y-4">
                      
                      <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                        deliveryMethod === 'standard' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/40'
                      }`}>
                        <div className="flex items-center gap-4">
                          <input 
                            type="radio" 
                            name="delivery" 
                            checked={deliveryMethod === 'standard'} 
                            onChange={() => setDeliveryMethod('standard')} 
                            className="w-5 h-5 text-primary border-border focus:ring-primary/20" 
                          />
                          <div className="flex-grow text-left">
                            <h4 className="font-bold text-foreground text-sm">Standard Shipping</h4>
                            <p className="text-xs text-muted-foreground">3-5 business days delivery window</p>
                          </div>
                          <span className="font-extrabold text-foreground text-sm">$9.99</span>
                        </div>
                      </label>

                      <label className={`block border-2 rounded-2xl p-4 cursor-pointer transition-all ${
                        deliveryMethod === 'express' ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/40'
                      }`}>
                        <div className="flex items-center gap-4">
                          <input 
                            type="radio" 
                            name="delivery" 
                            checked={deliveryMethod === 'express'} 
                            onChange={() => setDeliveryMethod('express')} 
                            className="w-5 h-5 text-primary border-border focus:ring-primary/20" 
                          />
                          <div className="flex-grow text-left">
                            <h4 className="font-bold text-foreground text-sm">Express Courier</h4>
                            <p className="text-xs text-muted-foreground">Priority overnight shipping 1-2 days</p>
                          </div>
                          <span className="font-extrabold text-foreground text-sm">$14.99</span>
                        </div>
                      </label>

                    </div>
                  </motion.div>
                )}

                {/* STEP 2: PAYMENT */}
                {currentStep === 2 && (
                  <motion.div key="step-2" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
                    <h2 className="text-xl font-bold text-foreground">Payment Details</h2>
                    
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setPaymentMethod('card')}
                        className={`flex-1 py-3.5 border-2 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider transition-all focus:outline-none ${
                          paymentMethod === 'card' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                        <CreditCard size={16} /> Credit Card
                      </button>
                      <button 
                        onClick={() => setPaymentMethod('paypal')}
                        className={`flex-1 py-3.5 border-2 rounded-2xl flex items-center justify-center gap-2 font-bold text-xs uppercase tracking-wider transition-all focus:outline-none ${
                          paymentMethod === 'paypal' ? 'border-primary bg-primary/5 text-primary' : 'border-border bg-background text-muted-foreground hover:border-primary/40'
                        }`}
                      >
                         PayPal
                      </button>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="grid md:grid-cols-12 gap-6 pt-4 items-center">
                        
                        {/* Interactive Card Preview */}
                        <div className="md:col-span-6 flex justify-center">
                          <div className="w-full max-w-[280px] aspect-[1.58/1] bg-gradient-to-br from-indigo-600 to-violet-800 text-white rounded-2xl p-5 shadow-lg relative flex flex-col justify-between select-none">
                            <span className="font-mono text-xs tracking-widest font-black">ShopVerse Pay</span>
                            <div className="space-y-1 mt-6 text-left">
                              <p className="font-mono text-sm tracking-widest leading-none">
                                {cardDetails.number ? cardDetails.number.replace(/(\d{4})/g, '$1 ').trim() : '•••• •••• •••• ••••'}
                              </p>
                              <div className="flex justify-between pt-4">
                                <div className="text-[9px] uppercase tracking-wider">
                                  <p className="opacity-50">Card Holder</p>
                                  <p className="font-bold font-sans mt-0.5 truncate max-w-[120px]">{cardDetails.name || 'Your Name'}</p>
                                </div>
                                <div className="text-[9px] uppercase tracking-wider text-right">
                                  <p className="opacity-50">Expiry</p>
                                  <p className="font-bold font-mono mt-0.5">{cardDetails.exp || 'MM/YY'}</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Input Box Fields */}
                        <div className="md:col-span-6 space-y-4">
                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Cardholder Name</label>
                            <input 
                              type="text" 
                              value={cardDetails.name} 
                              onChange={e => setCardDetails({...cardDetails, name: e.target.value})} 
                              className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold" 
                              placeholder="Jane Doe" 
                            />
                          </div>
                          <div className="space-y-1.5 text-left">
                            <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Card Number</label>
                            <input 
                              type="text" 
                              value={cardDetails.number} 
                              onChange={e => setCardDetails({...cardDetails, number: e.target.value.replace(/\D/g, '').slice(0, 16)})} 
                              className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold font-mono" 
                              placeholder="1234 5678 1234 5678" 
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1.5 text-left">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Expiry</label>
                              <input 
                                type="text" 
                                value={cardDetails.exp} 
                                onChange={e => setCardDetails({...cardDetails, exp: e.target.value.slice(0, 5)})} 
                                className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold font-mono" 
                                placeholder="MM/YY" 
                              />
                            </div>
                            <div className="space-y-1.5 text-left">
                              <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">CVC</label>
                              <input 
                                type="password" 
                                value={cardDetails.cvc} 
                                onChange={e => setCardDetails({...cardDetails, cvc: e.target.value.replace(/\D/g, '').slice(0, 3)})} 
                                className="w-full bg-background border border-border focus:border-primary/50 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-primary/10 font-semibold font-mono" 
                                placeholder="•••" 
                              />
                            </div>
                          </div>
                        </div>

                      </div>
                    )}
                    {paymentMethod === 'paypal' && (
                      <div className="p-12 border border-border rounded-2xl text-center bg-muted/30">
                         <p className="text-sm text-muted-foreground">You will be securely redirected to PayPal portal to log in and approve the debit amount.</p>
                      </div>
                    )}
                  </motion.div>
                )}

                {/* STEP 3: REVIEW */}
                {currentStep === 3 && (
                  <motion.div key="step-3" initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }} className="space-y-6">
                    <h2 className="text-xl font-bold text-foreground">Review Order</h2>
                    
                    <div className="space-y-6">
                      <div className="border border-border/80 p-5 rounded-2xl bg-card flex justify-between items-start">
                        <div className="text-left space-y-1">
                          <h4 className="font-bold text-foreground text-sm">Shipping Address</h4>
                          <p className="text-xs text-muted-foreground font-medium">{address.firstName} {address.lastName}</p>
                          <p className="text-xs text-muted-foreground font-medium">{address.street}, {address.city}, {address.state} {address.zip}</p>
                        </div>
                        <button onClick={() => setCurrentStep(0)} className="text-xs font-bold text-primary hover:underline focus:outline-none">Edit</button>
                      </div>

                      <div className="border border-border/80 p-5 rounded-2xl bg-card flex justify-between items-start">
                        <div className="text-left space-y-1">
                          <h4 className="font-bold text-foreground text-sm">Payment Method</h4>
                          {paymentMethod === 'card' ? (
                            <p className="text-xs text-muted-foreground font-medium flex items-center gap-1.5">
                              <CreditCard size={14} /> Card ending in {cardDetails.number.slice(-4) || '••••'}
                            </p>
                          ) : (
                            <p className="text-xs text-muted-foreground font-medium">PayPal Wallet</p>
                          )}
                        </div>
                        <button onClick={() => setCurrentStep(2)} className="text-xs font-bold text-primary hover:underline focus:outline-none">Edit</button>
                      </div>

                      <div className="border border-border/80 p-5 rounded-2xl bg-card space-y-4">
                        <h4 className="font-bold text-foreground text-sm text-left">Cart Items</h4>
                        <div className="divide-y divide-border/60">
                          {items.map(item => (
                            <div key={item.id} className="flex gap-4 py-3.5 first:pt-0 last:pb-0">
                              <img src={item.imageUrl} alt={item.productName} className="w-12 h-12 rounded-xl object-cover bg-muted/40 border border-border" />
                              <div className="flex-grow text-left">
                                <h5 className="font-bold text-xs text-foreground line-clamp-1">{item.productName}</h5>
                                <p className="text-[10px] text-muted-foreground mt-0.5">Quantity: {item.quantity}</p>
                              </div>
                              <span className="font-extrabold text-xs text-foreground">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Action Stepper buttons */}
              <div className="mt-10 pt-6 border-t border-border flex justify-between items-center">
                {currentStep > 0 ? (
                  <button 
                    onClick={handleBack} 
                    className="flex items-center gap-1.5 text-xs font-bold text-foreground hover:text-primary px-4 py-2 hover:bg-muted rounded-xl transition-all focus:outline-none"
                  >
                    <ArrowLeft size={14} /> Back
                  </button>
                ) : <div />}
                
                {currentStep < steps.length - 1 ? (
                  <button 
                    onClick={handleNext} 
                    className="bg-primary hover:bg-primary/95 text-primary-foreground px-6 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-md focus:outline-none"
                  >
                    Continue <ArrowRight size={14} />
                  </button>
                ) : (
                  <button 
                    onClick={handlePlaceOrder} 
                    disabled={loading} 
                    className="bg-primary hover:bg-primary/95 text-primary-foreground px-8 py-3 rounded-xl font-bold text-sm flex items-center gap-2 transition-all shadow-lg shadow-primary/25 disabled:opacity-50 focus:outline-none"
                  >
                    {loading ? 'Processing...' : 'Place Order'} <ShieldCheck size={18} />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right Side Summary panel */}
          <div className="lg:col-span-4">
             <div className="bg-card border border-border rounded-3xl p-6 shadow-sm sticky top-24 space-y-6">
                <h2 className="text-lg font-extrabold text-foreground pb-4 border-b border-border/80">Order Summary</h2>
                
                <div className="space-y-4 text-xs font-semibold">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal ({items.length} items)</span>
                    <span className="text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GST (18%)</span>
                    <span className="text-foreground">${gst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping Mode</span>
                    <span>
                      {deliveryCost === 0 ? <span className="text-emerald-500 font-extrabold">FREE</span> : `$${deliveryCost.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                <div className="border-t border-border pt-4 text-left">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-foreground">Total Amount</span>
                    <span className="text-xl font-black text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
