import { ProposalStatus, DiscountType, ServiceItem } from '@/types'

export interface WizardState {
  currentStep: number;
  
  // Step 1: Client
  client_name: string;
  client_email: string;
  client_company: string;
  client_phone: string;

  // Step 2: Project
  project_name: string;
  project_description: string;
  valid_until: string;
  estimated_weeks: number;
  payment_terms: string;

  // Step 3: Services
  services: ServiceItem[];

  // Step 4: Costs
  discount_type: DiscountType | "none"; // 'none' translates to no discount on submit
  discount_value: number;
  apply_iva: boolean;
  notes: string;

  // Meta
  isSubmitting: boolean;
  error: string | null;
}

export type WizardAction = 
  | { type: 'SET_STEP'; payload: number }
  | { type: 'NEXT_STEP' }
  | { type: 'PREV_STEP' }
  | { type: 'UPDATE_FIELD'; field: keyof WizardState; value: any }
  | { type: 'ADD_SERVICE'; payload: ServiceItem }
  | { type: 'REMOVE_SERVICE'; payload: number }
  | { type: 'UPDATE_SERVICE'; index: number; field: keyof ServiceItem; value: any }
  | { type: 'SET_SUBMITTING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null };

export const initialState: WizardState = {
  currentStep: 1,
  client_name: '',
  client_email: '',
  client_company: '',
  client_phone: '+52 ',
  project_name: '',
  project_description: '',
  valid_until: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  estimated_weeks: 4,
  payment_terms: '50% de anticipo para iniciar el proyecto, 50% restante al entregar el proyecto terminado.',
  services: [],
  discount_type: 'none',
  discount_value: 0,
  apply_iva: true,
  notes: '',
  isSubmitting: false,
  error: null,
};

export function wizardReducer(state: WizardState, action: WizardAction): WizardState {
  switch (action.type) {
    case 'SET_STEP':
      return { ...state, currentStep: action.payload };
    case 'NEXT_STEP':
      return { ...state, currentStep: Math.min(state.currentStep + 1, 5) };
    case 'PREV_STEP':
      return { ...state, currentStep: Math.max(state.currentStep - 1, 1) };
    case 'UPDATE_FIELD':
      return { ...state, [action.field]: action.value };
    case 'ADD_SERVICE':
      return { ...state, services: [...state.services, action.payload] };
    case 'REMOVE_SERVICE':
      return { ...state, services: state.services.filter((_, i) => i !== action.payload) };
    case 'UPDATE_SERVICE':
      const newServices = [...state.services];
      newServices[action.index] = { 
        ...newServices[action.index], 
        [action.field]: action.value,
      };
      // Auto-calculate total when unit_price or quantity changes
      if (action.field === 'unit_price' || action.field === 'quantity') {
        newServices[action.index].total = newServices[action.index].unit_price * newServices[action.index].quantity;
      }
      return { ...state, services: newServices };
    case 'SET_SUBMITTING':
      return { ...state, isSubmitting: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
}

export function generateSlug(projectName: string): string {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  
  const formattedProjectName = projectName
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // remove accents
    .replace(/[^a-z0-9]+/g, '-') // replace non-alphanumeric with dashes
    .replace(/(^-|-$)+/g, ''); // trim dashes
    
  const randomChars = Math.random().toString(36).substring(2, 6);
  
  return `${year}-${month}-${formattedProjectName}-${randomChars}`;
}
