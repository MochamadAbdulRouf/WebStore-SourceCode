
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { Cart } from "@/components/Cart";
import { useCart } from "@/contexts/CartContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, CreditCard, ArrowRight } from "lucide-react";
import { toast } from "sonner";

type CheckoutStep = "cart" | "shipping" | "payment" | "confirmation";

const Checkout = () => {
  const navigate = useNavigate();
  const { state, clearCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");
  
  // Simple forms state
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
  });

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setShippingInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPaymentInfo((prev) => ({ ...prev, [name]: value }));
  };

  const isShippingValid = () => {
    return (
      shippingInfo.firstName && 
      shippingInfo.lastName && 
      shippingInfo.email && 
      shippingInfo.address && 
      shippingInfo.city && 
      shippingInfo.state && 
      shippingInfo.postalCode && 
      shippingInfo.country
    );
  };

  const isPaymentValid = () => {
    return (
      paymentInfo.cardName && 
      paymentInfo.cardNumber && 
      paymentInfo.expiryDate && 
      paymentInfo.cvv
    );
  };

  const handleNextStep = () => {
    if (currentStep === "cart") {
      if (state.items.length === 0) {
        toast.error("Your cart is empty");
        return;
      }
      setCurrentStep("shipping");
    } else if (currentStep === "shipping") {
      if (!isShippingValid()) {
        toast.error("Please fill all shipping fields");
        return;
      }
      setCurrentStep("payment");
    } else if (currentStep === "payment") {
      if (!isPaymentValid()) {
        toast.error("Please fill all payment fields");
        return;
      }
      // Process order - in a real app, you'd submit to a backend here
      setCurrentStep("confirmation");
    } else if (currentStep === "confirmation") {
      clearCart();
      navigate("/");
      toast.success("Thank you for your order!");
    }
  };

  const handlePreviousStep = () => {
    if (currentStep === "shipping") setCurrentStep("cart");
    if (currentStep === "payment") setCurrentStep("shipping");
  };

  // Render step indicators
  const renderStepIndicators = () => {
    const steps = [
      { key: "cart", label: "Cart" },
      { key: "shipping", label: "Shipping" },
      { key: "payment", label: "Payment" },
      { key: "confirmation", label: "Confirmation" },
    ];

    return (
      <div className="flex items-center justify-center mb-8">
        {steps.map((step, index) => (
          <React.Fragment key={step.key}>
            {/* Step circle */}
            <div 
              className={`
                w-8 h-8 rounded-full flex items-center justify-center 
                ${currentStep === step.key 
                  ? "bg-primary text-white" 
                  : currentStep === "confirmation" || 
                    steps.findIndex(s => s.key === currentStep) > index 
                      ? "bg-primary/20 text-primary" 
                      : "bg-muted text-muted-foreground"
                }
              `}
            >
              {currentStep === "confirmation" || 
               steps.findIndex(s => s.key === currentStep) > index ? (
                <Check className="h-4 w-4" />
              ) : (
                index + 1
              )}
            </div>
            
            {/* Connector line */}
            {index < steps.length - 1 && (
              <div 
                className={`
                  h-0.5 w-10 mx-1
                  ${currentStep === "confirmation" || 
                    (steps.findIndex(s => s.key === currentStep) > index)
                      ? "bg-primary/60" 
                      : "bg-muted"
                  }
                `}
              />
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 pt-24 pb-16">
        <div className="container mx-auto px-4 md:px-6 max-w-4xl">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold tracking-tight mb-2">
              Checkout
            </h1>
            <p className="text-muted-foreground">
              Complete your purchase
            </p>
          </div>
          
          {/* Step Indicators */}
          {renderStepIndicators()}
          
          {/* Back Button */}
          {currentStep !== "cart" && currentStep !== "confirmation" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousStep}
              className="mb-6 pl-0 group"
            >
              <ArrowLeft className="h-4 w-4 mr-2 transition-transform group-hover:-translate-x-1" />
              Back to {currentStep === "payment" ? "Shipping" : "Cart"}
            </Button>
          )}
          
          {/* Step Content */}
          <div className="bg-white border border-border/60 rounded-xl shadow-sm overflow-hidden">
            {currentStep === "cart" && (
              <div className="p-6">
                <Cart />
              </div>
            )}
            
            {currentStep === "shipping" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">First Name</label>
                    <Input
                      name="firstName"
                      value={shippingInfo.firstName}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Last Name</label>
                    <Input
                      name="lastName"
                      value={shippingInfo.lastName}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Email</label>
                    <Input
                      type="email"
                      name="email"
                      value={shippingInfo.email}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1">Address</label>
                    <Input
                      name="address"
                      value={shippingInfo.address}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <Input
                      name="city"
                      value={shippingInfo.city}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <Input
                      name="state"
                      value={shippingInfo.state}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Postal Code</label>
                    <Input
                      name="postalCode"
                      value={shippingInfo.postalCode}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Country</label>
                    <Input
                      name="country"
                      value={shippingInfo.country}
                      onChange={handleShippingChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Total:</span> ${state.totalPrice.toFixed(2)}
                  </div>
                  
                  <Button onClick={handleNextStep}>
                    Continue to Payment
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === "payment" && (
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-6">Payment Information</h2>
                
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium mb-1">Name on Card</label>
                    <Input
                      name="cardName"
                      value={paymentInfo.cardName}
                      onChange={handlePaymentChange}
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium mb-1">Card Number</label>
                    <Input
                      name="cardNumber"
                      value={paymentInfo.cardNumber}
                      onChange={handlePaymentChange}
                      placeholder="1234 5678 9012 3456"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Expiry Date</label>
                      <Input
                        name="expiryDate"
                        value={paymentInfo.expiryDate}
                        onChange={handlePaymentChange}
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1">CVV</label>
                      <Input
                        name="cvv"
                        value={paymentInfo.cvv}
                        onChange={handlePaymentChange}
                        placeholder="123"
                        maxLength={4}
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-6 border-t border-border">
                  <div className="text-sm text-muted-foreground">
                    <span className="font-medium text-foreground">Total:</span> ${state.totalPrice.toFixed(2)}
                  </div>
                  
                  <Button onClick={handleNextStep}>
                    <CreditCard className="mr-2 h-4 w-4" />
                    Place Order
                  </Button>
                </div>
              </div>
            )}
            
            {currentStep === "confirmation" && (
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Check className="h-8 w-8 text-primary" />
                </div>
                
                <h2 className="text-2xl font-bold mb-4">Thank You for Your Order!</h2>
                
                <p className="text-muted-foreground mb-6">
                  Your order has been received and is being processed. 
                  You will receive a confirmation email shortly.
                </p>
                
                <div className="bg-accent/50 rounded-lg p-4 mb-6 max-w-md mx-auto">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <p className="text-sm text-muted-foreground mb-1">
                    Items: {state.totalItems}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total: ${state.totalPrice.toFixed(2)}
                  </p>
                </div>
                
                <Button onClick={handleNextStep}>
                  Continue Shopping
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>
      
      {/* Footer (simplified) */}
      <footer className="bg-muted/30 py-8">
        <div className="container mx-auto px-4 md:px-6 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} SimpleStore. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Checkout;
