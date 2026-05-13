export type Report = {
  id: string;
  filename: string;
  createdAt: string;
  analysis: {
    result: 'normal' | 'abnormal';
    confidence: number;
    recommendations: string[];
    rawOutput?: any; // To store the full raw output from AI if needed for debugging/future features
  };
};

