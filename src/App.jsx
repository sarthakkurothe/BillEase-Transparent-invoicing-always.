import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Upload, FileText, Users, Package } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeProvider } from "@/components/theme-provider";
import { ThemeToggle } from "@/components/ThemeToggle";
import bannerImage from './assets/banner.png';
import patternImage from './assets/pattern.png'; // Import the pattern image
import FileUpload from './components/FileUpload';
import InvoicesTable from './components/InvoicesTable';
import ProductsTable from './components/ProductsTable';
import CustomersTable from './components/CustomersTable';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { Typewriter } from 'react-simple-typewriter';

// Define the styled component with gradient animation
const GradientText = styled(motion.span)`
  font-size: inherit;
  font-weight: inherit;
  background: linear-gradient(270deg, #3a1c71, #d76d77, #ffaf7b);
  background-size: 600% 600%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  animation: gradient-animation 8s ease infinite;

  @keyframes gradient-animation {
    0% {
      background-position: 0% 50%;
    }
    50% {
      background-position: 100% 50%;
    }
    100% {
      background-position: 0% 50%;
    }
  }
`;

// Define the styled button with gradient background
const GradientButton = styled.button`
  background: linear-gradient(270deg, #3a1c71, #d76d77, #ffaf7b);
  color: white;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background-position: 100% 0;
  }
`;

function App() {
  const error = useSelector(state => state.invoices.error);
  const subtitles = [
    "Your journey to hassle-free invoicing starts here",
    "Let your invoices work smarter, not harder",
    "Automate your billing process"
  ];

  const [currentSubtitleIndex, setCurrentSubtitleIndex] = useState(0);
  const [typewriterCompleted, setTypewriterCompleted] = useState(false); // Track completion
  const uploadSectionRef = useRef(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSubtitleIndex((prevIndex) => (prevIndex + 1) % subtitles.length);
    }, 4000); // Change subtitle every 4 seconds

    return () => clearInterval(interval);
  }, [subtitles.length]);

  const handleGetStartedClick = () => {
    if (uploadSectionRef.current) {
      uploadSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTypewriterDone = () => {
    setTypewriterCompleted(true); // Update the state when typing is complete
  };

  return (
    <ThemeProvider storageKey="invoice-theme">
      <div className="min-h-screen bg-background text-foreground">
        {/* Header Section with Banner */}
        <div className="flex h-[700px] relative">
          <div className="w-1/2 bg-cover bg-center" style={{ backgroundImage: `url(${bannerImage})`, filter: 'brightness(0.8)' }}></div> 
          <div className="w-1/2 flex items-center justify-center relative" style={{ backgroundImage: `url(${patternImage})`, backgroundSize: 'cover' }}>
            <div className="absolute top-4 right-4 z-10">
              <ThemeToggle />
            </div>
            <div className="text-center">
              <h1 className="text-5xl font-bold mb-6">
                BillEase: 
                <GradientText>
                  {!typewriterCompleted ? (
                    <Typewriter
                      words={["Simplify your billing, effortlessly."]}
                      loop={false}
                      cursor
                      cursorStyle=""
                      typeSpeed={50}
                      deleteSpeed={30}
                      delaySpeed={700}
                      onDone={handleTypewriterDone} // Callback on completion
                    />
                  ) : (
                    "Simplify your billing, effortlessly."
                  )}
                </GradientText>
              </h1>
              <div className="mt-6">
                <motion.p
                  className="text-muted-foreground text-xl font-medium"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                  key={currentSubtitleIndex}
                >
                  {subtitles[currentSubtitleIndex]}
                </motion.p>
              </div>
              <div className="mt-8"> {/* Added margin for spacing */}
                <GradientButton onClick={handleGetStartedClick}>Get Started</GradientButton>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Section */}
        <div ref={uploadSectionRef} className="max-w-[1200px] mx-auto p-8 space-y-6">
          {/* File Upload Section */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Upload Documents
              </CardTitle>
            </CardHeader>
            <CardContent>
              <FileUpload />
              {error && (
                <div className="mt-4 p-4 bg-destructive/10 text-destructive rounded-md text-sm">
                  {error}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Main Content Tabs */}
          <Card className="border-border">
            <Tabs defaultValue="invoices" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="invoices" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Invoices
                </TabsTrigger>
                <TabsTrigger value="products" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Products
                </TabsTrigger>
                <TabsTrigger value="customers" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Customers
                </TabsTrigger>
              </TabsList>

              <CardContent className="pt-6">
                <TabsContent value="invoices">
                  <InvoicesTable />
                </TabsContent>
                <TabsContent value="products">
                  <ProductsTable />
                </TabsContent>
                <TabsContent value="customers">
                  <CustomersTable />
                </TabsContent>
              </CardContent>
            </Tabs>
          </Card>
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;
