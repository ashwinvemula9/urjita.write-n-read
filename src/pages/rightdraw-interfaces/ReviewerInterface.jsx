import React, { useState } from 'react';
import { Eye, X, AlertTriangle, Check, ArrowRight } from 'lucide-react';
import { Card, Button, Input, Select, FormSection } from '../../components/common/ReusableComponents';

const ReviewerInterface = () => {
  const [view, setView] = useState('queue');
  const [selectedForm, setSelectedForm] = useState(null);
  const [reviewData, setReviewData] = useState({});
  const [deviations, setDeviations] = useState([]);

  // Sample queue data - replace with API call
  const submissionQueue = [
    {
      id: 1,
      partNumber: 'URJ-2024-001',
      submittedBy: 'John Designer',
      submissionDate: '2024-01-05',
      status: 'pending'
    },
    {
      id: 2,
      partNumber: 'URJ-2024-002',
      submittedBy: 'Sarah Engineer',
      submissionDate: '2024-01-06',
      status: 'pending'
    }
  ];

  const materialOptions = [
    { value: 'alumina_ceramic', label: 'Alumina Ceramic' },
    { value: 'fr4_it180a', label: 'ITEQ: FR4 Grade IT180A' },
    { value: 'ad250c', label: 'Rogers: AD250C' }
  ];

  const thicknessOptions = [
    { value: '0.004', label: '0.004"' },
    { value: '0.0066', label: '0.0066"' },
    { value: '0.0073', label: '0.0073"' }
  ];

  const checkDeviations = (reviewData) => {
    const deviations = [];
    if (parseFloat(reviewData.copperThickness) > 2) {
      deviations.push({
        field: 'Copper Thickness',
        value: reviewData.copperThickness,
        acceptedRange: '0.5 - 2 oz',
        severity: 'high'
      });
    }
    return deviations;
  };

  const handleReviewSubmit = () => {
    const foundDeviations = checkDeviations(reviewData);
    setDeviations(foundDeviations);
    setView(foundDeviations.length === 0 ? 'queue' : 'deviations');
  };

  const renderQueue = () => (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Queue</h2>
      {submissionQueue.map((submission) => (
        <Card key={submission.id}>
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">{submission.partNumber}</h3>
              <p className="text-sm text-gray-600">Submitted by: {submission.submittedBy}</p>
              <p className="text-sm text-gray-500">Date: {submission.submissionDate}</p>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => {
                  setSelectedForm(submission);
                  setView('review');
                }}
              >
                <Eye className="w-4 h-4 mr-2" />
                Review
              </Button>
              <Button
                variant="danger"
                onClick={() => console.log('Reject')}
              >
                <X className="w-4 h-4 mr-2" />
                Reject
              </Button>
            </div>
          </div>
          {submission.status === 'pending_approval' && (
            <div className="mt-4 flex items-center text-orange-500">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Pending Approval
            </div>
          )}
        </Card>
      ))}
    </div>
  );

  const renderReviewForm = () => (
    <div className="space-y-6">
      <Card title={`Review Form - ${selectedForm?.partNumber}`}>
        <FormSection title="Material Specifications">
          <Select
            label="Dielectric Material"
            options={materialOptions}
            value={reviewData.dielectricMaterial}
            onChange={(value) => setReviewData({...reviewData, dielectricMaterial: value})}
            required
          />
          <Select
            label="Dielectric Thickness"
            options={thicknessOptions}
            value={reviewData.dielectricThickness}
            onChange={(value) => setReviewData({...reviewData, dielectricThickness: value})}
            required
          />
          <Input
            label="Copper Thickness"
            type="number"
            value={reviewData.copperThickness}
            onChange={(value) => setReviewData({...reviewData, copperThickness: value})}
            required
            placeholder="Enter thickness in oz"
          />
        </FormSection>

        <div className="flex justify-end gap-4 mt-6">
          <Button
            variant="secondary"
            onClick={() => setView('queue')}
          >
            Cancel
          </Button>
          <Button
            onClick={handleReviewSubmit}
          >
            <Check className="w-4 h-4 mr-2" />
            Submit Review
          </Button>
        </div>
      </Card>
    </div>
  );

  const renderDeviations = () => (
    <div className="space-y-6">
      <Card title="Deviations Found">
        {deviations.map((deviation, index) => (
          <div key={index} className="p-4 border-l-4 border-red-500 bg-red-50 rounded-r mb-4">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <h3 className="font-semibold text-gray-800">{deviation.field}</h3>
                <p className="text-sm text-gray-600">
                  Current value: <span className="text-red-500">{deviation.value}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Accepted range: {deviation.acceptedRange}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div className="flex justify-end gap-4">
          <Button
            variant="secondary"
            onClick={() => setView('review')}
          >
            Back to Review
          </Button>
          <Button
            onClick={() => setView('queue')}
          >
            Approve with Deviations
          </Button>
        </div>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {view === 'queue' && renderQueue()}
        {view === 'review' && renderReviewForm()}
        {view === 'deviations' && renderDeviations()}
      </div>
    </div>
  );
};

export default ReviewerInterface;