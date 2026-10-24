'use client';

import React, { createContext, useCallback, useContext, useState } from 'react';
import type { QrData } from '@/lib/api';

export interface WizardState {
  selectedModel: string | null;
  modelName: string;
  modelFramework: string;
  region: string;
  zone: string;
  scopeLevel: 'national' | 'province' | 'district';
  sampleSize: number;
  minAge: number;
  maxAge: number;
  targetGender: string;
  targetIncome: string;
  targetMaritalStatus: string;
  targetOccupation: string;
  targetZone: string;
  productInfo: Record<string, any>;
  customerEmail: string;
  surveyId: string;
  priceAmount: number;
  originalPrice: number;
  discountCode: string | null;
  discountAmount: number;
  isFree: boolean;
  qrData: QrData | null;
  currentStep: number;
}

interface WizardContextType {
  state: WizardState;
  setStep: (step: number) => void;
  updateModel: (id: string, name: string, framework: string) => void;
  updateSampleConfig: (config: Partial<WizardState>) => void;
  updateProductInfo: (info: Record<string, any>, email?: string) => void;
  updatePayment: (
    surveyId: string,
    price: number,
    qr: QrData | null,
    meta?: { originalPrice?: number; discountCode?: string | null; discountAmount?: number; isFree?: boolean }
  ) => void;
  setDiscountState: (meta: {
    priceAmount: number;
    originalPrice?: number;
    discountCode?: string | null;
    discountAmount?: number;
    qrData?: QrData | null;
    isFree?: boolean;
  }) => void;
  reset: () => void;
}

const INITIAL_STATE: WizardState = {
  selectedModel: null,
  modelName: '',
  modelFramework: '',
  region: 'Toàn quốc',
  zone: '',
  scopeLevel: 'national',
  sampleSize: 1000,
  minAge: 18,
  maxAge: 65,
  targetGender: 'all',
  targetIncome: 'all',
  targetMaritalStatus: 'all',
  targetOccupation: 'all',
  targetZone: 'all',
  productInfo: {},
  customerEmail: '',
  surveyId: '',
  priceAmount: 0,
  originalPrice: 0,
  discountCode: null,
  discountAmount: 0,
  isFree: false,
  qrData: null,
  currentStep: 1,
};

const WizardContext = createContext<WizardContextType | null>(null);

export function WizardProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<WizardState>(INITIAL_STATE);

  const setStep = useCallback((step: number) => {
    setState(prev => ({ ...prev, currentStep: step }));
  }, []);

  const updateModel = useCallback((id: string, name: string, framework: string) => {
    setState(prev => ({ ...prev, selectedModel: id, modelName: name, modelFramework: framework }));
  }, []);

  const updateSampleConfig = useCallback((config: Partial<WizardState>) => {
    setState(prev => ({ ...prev, ...config }));
  }, []);

  const updateProductInfo = useCallback((info: Record<string, string>, email?: string) => {
    setState(prev => ({
      ...prev,
      productInfo: info,
      customerEmail: email ?? prev.customerEmail,
    }));
  }, []);

  const updatePayment = useCallback((
    surveyId: string,
    price: number,
    qr: QrData | null,
    meta?: { originalPrice?: number; discountCode?: string | null; discountAmount?: number; isFree?: boolean }
  ) => {
    setState(prev => ({
      ...prev,
      surveyId,
      priceAmount: price,
      originalPrice: meta?.originalPrice ?? price,
      discountCode: meta?.discountCode ?? null,
      discountAmount: meta?.discountAmount ?? 0,
      isFree: meta?.isFree ?? (price === 0),
      qrData: qr,
    }));
  }, []);

  const setDiscountState = useCallback((meta: {
    priceAmount: number;
    originalPrice?: number;
    discountCode?: string | null;
    discountAmount?: number;
    qrData?: QrData | null;
    isFree?: boolean;
  }) => {
    setState(prev => ({
      ...prev,
      priceAmount: meta.priceAmount,
      originalPrice: meta.originalPrice ?? prev.originalPrice,
      discountCode: meta.discountCode !== undefined ? meta.discountCode : prev.discountCode,
      discountAmount: meta.discountAmount ?? prev.discountAmount,
      qrData: meta.qrData !== undefined ? meta.qrData : prev.qrData,
      isFree: meta.isFree !== undefined ? meta.isFree : (meta.priceAmount === 0),
    }));
  }, []);

  const reset = useCallback(() => setState(INITIAL_STATE), []);

  return (
    <WizardContext.Provider value={{ state, setStep, updateModel, updateSampleConfig, updateProductInfo, updatePayment, setDiscountState, reset }}>
      {children}
    </WizardContext.Provider>
  );
}

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error('useWizard must be used inside WizardProvider');
  return ctx;
}
