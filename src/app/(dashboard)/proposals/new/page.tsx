"use client";

import React, { useReducer, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  Save,
  Loader2,
  CheckCircle2,
} from "lucide-react";
import {
  wizardReducer,
  initialState,
  WizardState,
  generateSlug,
} from "./wizardLogic";

const COMMON_SERVICES = [
  "Diseño UI/UX",
  "Desarrollo Frontend",
  "Desarrollo Full-stack",
  "Landing Page",
  "E-commerce",
  "Consultoría",
  "Mantenimiento",
  "SEO",
  "Integración de pagos",
];

export default function NewProposalWizard() {
  const router = useRouter();
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  // Real-time calculations
  const { subtotal, subtotalAfterDiscount, ivaAmount, totalFinal } =
    useMemo(() => {
      const defaultSubtotal = state.services.reduce(
        (acc, service) => acc + (service.total || 0),
        0,
      );

      let defaultSubAfterDisc = defaultSubtotal;
      if (state.discount_type === "percentage") {
        defaultSubAfterDisc =
          defaultSubtotal - defaultSubtotal * (state.discount_value / 100);
      } else if (state.discount_type === "fixed") {
        defaultSubAfterDisc = Math.max(
          0,
          defaultSubtotal - state.discount_value,
        );
      }

      const defaultIva = state.apply_iva ? defaultSubAfterDisc * 0.16 : 0;
      const defaultTotal = defaultSubAfterDisc + defaultIva;

      return {
        subtotal: defaultSubtotal,
        subtotalAfterDiscount: defaultSubAfterDisc,
        ivaAmount: defaultIva,
        totalFinal: defaultTotal,
      };
    }, [
      state.services,
      state.discount_type,
      state.discount_value,
      state.apply_iva,
    ]);

  const formatter = new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  });

  // Submit Handler
  const handleSave = async (status: "draft" | "sent") => {
    dispatch({ type: "SET_SUBMITTING", payload: true });
    dispatch({ type: "SET_ERROR", payload: null });

    try {
      const slug = generateSlug(state.project_name);

      const payload = {
        slug,
        status,
        language: state.language,
        client_name: state.client_name,
        client_email: state.client_email,
        client_company: state.client_company,
        client_phone: state.client_phone,
        project_name: state.project_name,
        project_description: state.project_description,
        services: state.services,
        subtotal: subtotal,
        discount_type:
          state.discount_type === "none" ? null : state.discount_type,
        discount_value: state.discount_value,
        discount_amount: subtotal - subtotalAfterDiscount,
        subtotal_after_discount: subtotalAfterDiscount,
        iva_percentage: state.apply_iva ? 16 : 0,
        iva_amount: ivaAmount,
        total: totalFinal,
        payment_terms: state.payment_terms,
        delivery_weeks: state.estimated_weeks,
        valid_until: state.valid_until,
        notes: state.notes,
      };

      const res = await fetch("/api/proposals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to save the proposal");
      }

      const { id } = await res.json();

      // Auto-send email to client
      const sendRes = await fetch(`/api/proposals/${id}/send`, {
        method: "POST",
      });
      if (!sendRes.ok) {
        console.error("Failed to send proposal email");
      }

      router.push(`/proposals/${id}`);
      router.refresh();
    } catch (e: any) {
      dispatch({ type: "SET_ERROR", payload: e.message });
    } finally {
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  // Next step validation
  const validateCurrentStep = () => {
    if (state.currentStep === 1) {
      return (
        state.client_name.trim() !== "" && state.client_email.trim() !== ""
      );
    }
    if (state.currentStep === 2) {
      return state.project_name.trim() !== "" && state.estimated_weeks > 0;
    }
    if (state.currentStep === 3) {
      return (
        state.services.length > 0 &&
        state.services.every(
          (s) => s.name.trim() !== "" && s.unit_price > 0 && s.quantity > 0,
        )
      );
    }
    return true;
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header & Progress */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-[var(--color-text-primary)]">
          Nueva Propuesta
        </h1>
        <p className="text-[var(--color-text-secondary)] mt-2">
          Paso {state.currentStep} de 5
        </p>

        <div className="flex items-center mt-4 gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <React.Fragment key={step}>
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm transition-colors ${
                  step === state.currentStep
                    ? "bg-[var(--color-accent)] text-black"
                    : step < state.currentStep
                      ? "bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] border border-[var(--color-accent)]"
                      : "bg-[var(--color-surface-elevated)] border border-[var(--color-border)] text-[var(--color-text-secondary)]"
                }`}>
                {step < state.currentStep ? (
                  <CheckCircle2 className="w-4 h-4 text-[var(--color-accent)]" />
                ) : (
                  step
                )}
              </div>
              {step < 5 && (
                <div
                  className={`flex-1 h-0.5 transition-colors ${step < state.currentStep ? "bg-[var(--color-accent)]" : "bg-[var(--color-border)]"}`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-sm p-6 sm:p-8">
        {/* Step 1: Client Data */}
        {state.currentStep === 1 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Datos del cliente
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={state.client_name}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "client_name",
                      value: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                  placeholder="Ej: John Doe"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Idioma de la Propuesta *
                </label>
                <select
                  value={state.language}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "language",
                      value: e.target.value as "en" | "es",
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]">
                  <option value="es">Español</option>
                  <option value="en">Inglés</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  value={state.client_email}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "client_email",
                      value: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Empresa / Negocio (Opcional)
                </label>
                <input
                  type="text"
                  value={state.client_company}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "client_company",
                      value: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                  placeholder="Acme Corp"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  WhatsApp (Opcional)
                </label>
                <input
                  type="text"
                  value={state.client_phone}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "client_phone",
                      value: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Project Info */}
        {state.currentStep === 2 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Información del Proyecto
            </h2>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Nombre del proyecto *
              </label>
              <input
                type="text"
                value={state.project_name}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    field: "project_name",
                    value: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                placeholder="Ej: Rediseño Landing Page"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Descripción breve
              </label>
              <textarea
                rows={3}
                value={state.project_description}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    field: "project_description",
                    value: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                placeholder="El cliente necesita modernizar su presencia web..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Semanas estimadas *
                </label>
                <input
                  type="number"
                  min="1"
                  value={state.estimated_weeks || ""}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "estimated_weeks",
                      value: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                  Válido hasta
                </label>
                <input
                  type="date"
                  value={state.valid_until}
                  onChange={(e) =>
                    dispatch({
                      type: "UPDATE_FIELD",
                      field: "valid_until",
                      value: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                Condiciones de pago
              </label>
              <textarea
                rows={2}
                value={state.payment_terms}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_FIELD",
                    field: "payment_terms",
                    value: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
              />
            </div>
          </div>
        )}

        {/* Step 3: Services */}
        {state.currentStep === 3 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Servicios Cotizados
            </h2>

            <div className="flex flex-wrap gap-2">
              {COMMON_SERVICES.map((srv) => (
                <button
                  key={srv}
                  onClick={() =>
                    dispatch({
                      type: "ADD_SERVICE",
                      payload: {
                        name: srv,
                        description: "",
                        quantity: 1,
                        unit_price: 0,
                        total: 0,
                      },
                    })
                  }
                  className="text-xs px-3 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] transition-colors text-[var(--color-text-secondary)]">
                  + {srv}
                </button>
              ))}
            </div>

            <div className="space-y-4 mt-6">
              {state.services.map((service, index) => (
                <div
                  key={index}
                  className="p-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)]/50 relative group">
                  <button
                    onClick={() =>
                      dispatch({ type: "REMOVE_SERVICE", payload: index })
                    }
                    className="absolute top-4 right-4 text-[var(--color-text-secondary)] hover:text-red-500 transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-12 pr-8">
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                        Nombre del Servicio *
                      </label>
                      <input
                        type="text"
                        value={service.name}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_SERVICE",
                            index,
                            field: "name",
                            value: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)] font-medium"
                      />
                    </div>
                    <div className="md:col-span-12">
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                        Alcance / Descripción
                      </label>
                      <textarea
                        rows={2}
                        value={service.description || ""}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_SERVICE",
                            index,
                            field: "description",
                            value: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                      />
                    </div>
                    <div className="md:col-span-4">
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                        P. Unitario *
                      </label>
                      <div className="relative">
                        <span className="absolute left-3 top-2 text-[var(--color-text-secondary)]">
                          $
                        </span>
                        <input
                          type="number"
                          min="0"
                          value={service.unit_price || ""}
                          onChange={(e) =>
                            dispatch({
                              type: "UPDATE_SERVICE",
                              index,
                              field: "unit_price",
                              value: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full pl-7 pr-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                        />
                      </div>
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                        Cantidad *
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={service.quantity || ""}
                        onChange={(e) =>
                          dispatch({
                            type: "UPDATE_SERVICE",
                            index,
                            field: "quantity",
                            value: parseInt(e.target.value) || 0,
                          })
                        }
                        className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface)] text-[var(--color-text-primary)] text-sm focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                      />
                    </div>
                    <div className="md:col-span-5 flex flex-col justify-end">
                      <label className="block text-xs font-medium text-[var(--color-text-secondary)] mb-1">
                        Subtotal (Auto)
                      </label>
                      <div className="px-3 py-2 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg text-[var(--color-text-primary)] font-medium text-sm">
                        {formatter.format(service.total || 0)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={() =>
                  dispatch({
                    type: "ADD_SERVICE",
                    payload: {
                      name: "",
                      description: "",
                      quantity: 1,
                      unit_price: 0,
                      total: 0,
                    },
                  })
                }
                className="w-full flex items-center justify-center gap-2 py-4 border border-dashed border-[var(--color-border)] rounded-xl text-[var(--color-text-secondary)] hover:text-[var(--color-accent)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/5 transition-colors font-medium text-sm">
                <Plus className="w-5 h-5" />
                Agregar servicio vacío
              </button>
            </div>
          </div>
        )}

        {/* Step 4: Costs and Discounts */}
        {state.currentStep === 4 && (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Costos y Descuentos
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Controls */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-2">
                    Descuento
                  </label>
                  <div className="flex bg-[var(--color-surface-elevated)] p-1 rounded-lg border border-[var(--color-border)]">
                    {(["none", "percentage", "fixed"] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() =>
                          dispatch({
                            type: "UPDATE_FIELD",
                            field: "discount_type",
                            value: type,
                          })
                        }
                        className={`flex-1 text-sm py-1.5 rounded-md font-medium transition-colors ${
                          state.discount_type === type
                            ? "bg-[var(--color-surface)] text-[var(--color-text-primary)] shadow-sm border border-[var(--color-border)]"
                            : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]"
                        }`}>
                        {type === "none"
                          ? "Ninguno"
                          : type === "percentage"
                            ? "Porcentaje"
                            : "Monto Fijo"}
                      </button>
                    ))}
                  </div>
                </div>

                {state.discount_type !== "none" && (
                  <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                      Valor del{" "}
                      {state.discount_type === "percentage"
                        ? "porcentaje (%)"
                        : "descuento ($)"}
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={state.discount_value || ""}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_FIELD",
                          field: "discount_value",
                          value: parseFloat(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                    />
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 border border-[var(--color-border)] rounded-xl bg-[var(--color-surface-elevated)]">
                  <input
                    type="checkbox"
                    id="apply_iva"
                    checked={state.apply_iva}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_FIELD",
                        field: "apply_iva",
                        value: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-[var(--color-accent)] rounded border-[var(--color-border)] bg-[var(--color-surface)]"
                  />
                  <label
                    htmlFor="apply_iva"
                    className="text-sm font-medium text-[var(--color-text-primary)] cursor-pointer select-none">
                    Aplicar IVA (16%) al total
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-primary)] mb-1">
                    Notas adicionales del presupuesto
                  </label>
                  <textarea
                    rows={3}
                    value={state.notes}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_FIELD",
                        field: "notes",
                        value: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-[var(--color-border)] rounded-lg bg-[var(--color-surface-elevated)] text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-accent)] focus:ring-1 focus:ring-[var(--color-accent)]"
                    placeholder="Ej: Estos precios no incluyen viáticos..."
                  />
                </div>
              </div>

              {/* Live Recap Panel */}
              <div className="bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl p-6 flex flex-col h-fit">
                <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-6">
                  Resumen Financiero
                </h3>

                <div className="space-y-4">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[var(--color-text-secondary)]">
                      Subtotal ({state.services.length} items)
                    </span>
                    <span className="font-medium text-[var(--color-text-primary)]">
                      {formatter.format(subtotal)}
                    </span>
                  </div>

                  {state.discount_type !== "none" && (
                    <div className="flex justify-between items-center text-sm text-[var(--color-accent)]">
                      <span>
                        Descuento (
                        {state.discount_type === "percentage"
                          ? `${state.discount_value}%`
                          : "Fijo"}
                        )
                      </span>
                      <span className="font-medium">
                        -{formatter.format(subtotal - subtotalAfterDiscount)}
                      </span>
                    </div>
                  )}

                  {state.discount_type !== "none" && (
                    <div className="flex justify-between items-center text-sm pt-4 border-t border-[var(--color-border)]">
                      <span className="text-[var(--color-text-secondary)]">
                        Subtotal con descuento
                      </span>
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {formatter.format(subtotalAfterDiscount)}
                      </span>
                    </div>
                  )}

                  {state.apply_iva && (
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-[var(--color-text-secondary)]">
                        IVA (16%)
                      </span>
                      <span className="font-medium text-[var(--color-text-primary)]">
                        {formatter.format(ivaAmount)}
                      </span>
                    </div>
                  )}

                  <div className="flex justify-between items-center pt-6 mt-2 border-t border-[var(--color-border)]">
                    <span className="text-base font-medium text-[var(--color-text-primary)]">
                      Total Final
                    </span>
                    <span className="text-2xl font-bold text-[var(--color-text-primary)]">
                      {formatter.format(totalFinal)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 5: Preview & Save */}
        {state.currentStep === 5 && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
              Vista Previa y Confirmación
            </h2>

            <div className="p-6 md:p-8 bg-[var(--color-background)] border border-[var(--color-border)] rounded-2xl">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-[var(--color-text-primary)]">
                    {state.project_name}
                  </h3>
                  <p className="text-[var(--color-text-secondary)] mt-1">
                    Preparado para:{" "}
                    <span className="text-[var(--color-text-primary)] font-medium">
                      {state.client_name}{" "}
                      {state.client_company ? `(${state.client_company})` : ""}
                    </span>
                  </p>
                </div>
                <div className="text-right text-sm text-[var(--color-text-secondary)]">
                  <p>Tiempo est: {state.estimated_weeks} Semanas</p>
                  <p>Validez: {state.valid_until}</p>
                </div>
              </div>

              <div className="mt-8 space-y-6">
                <div>
                  <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">
                    SERVICIOS ALMACENADOS
                  </h4>
                  <ul className="space-y-3">
                    {state.services.map((s, i) => (
                      <li
                        key={i}
                        className="flex justify-between text-sm py-2 border-b border-[var(--color-border)]">
                        <div>
                          <p className="font-medium text-[var(--color-text-primary)]">
                            {s.quantity}x {s.name}
                          </p>
                          {s.description && (
                            <p className="text-[var(--color-text-secondary)] text-xs mt-1 max-w-lg">
                              {s.description}
                            </p>
                          )}
                        </div>
                        <p className="font-medium text-[var(--color-text-primary)] pt-1">
                          {formatter.format(s.total || 0)}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex justify-end pt-4">
                  <div className="w-64 space-y-2 text-sm">
                    <div className="flex justify-between px-2">
                      <span className="text-[var(--color-text-secondary)]">
                        Subtotal:
                      </span>
                      <span className="font-medium">
                        {formatter.format(subtotal)}
                      </span>
                    </div>
                    {state.discount_type !== "none" && (
                      <div className="flex justify-between px-2 text-[var(--color-accent)]">
                        <span>Descuento:</span>
                        <span className="font-medium">
                          -{formatter.format(subtotal - subtotalAfterDiscount)}
                        </span>
                      </div>
                    )}
                    {state.apply_iva && (
                      <div className="flex justify-between px-2 pb-2">
                        <span className="text-[var(--color-text-secondary)]">
                          IVA (16%):
                        </span>
                        <span className="font-medium">
                          {formatter.format(ivaAmount)}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between p-3 bg-[var(--color-surface-elevated)] rounded-lg mt-2">
                      <span className="font-semibold text-[var(--color-text-primary)]">
                        Total:
                      </span>
                      <span className="font-bold text-[var(--color-text-primary)] text-lg">
                        {formatter.format(totalFinal)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {state.error && (
                <div className="mt-6 text-red-500 text-sm font-medium bg-red-500/10 p-4 rounded-lg border border-red-500/20">
                  {state.error}
                </div>
              )}

              <div className="mt-10 pt-6 border-t border-[var(--color-border)] grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => handleSave("draft")}
                  disabled={state.isSubmitting}
                  className="flex items-center justify-center gap-2 py-3 px-4 border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-primary)] rounded-lg hover:bg-[var(--color-surface-elevated)] transition-colors font-medium disabled:opacity-50">
                  <Save className="w-5 h-5" />
                  Guardar como Borrador
                </button>
                <button
                  onClick={() => handleSave("sent")}
                  disabled={state.isSubmitting}
                  className="flex items-center justify-center gap-2 py-3 px-4 bg-[var(--color-accent)] text-[#0a0a0a] rounded-lg hover:bg-[#e5e5e5] transition-colors font-medium shadow-sm disabled:opacity-50">
                  {state.isSubmitting ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-5 h-5" />
                  )}
                  {state.isSubmitting
                    ? "Guardando..."
                    : "Guardar y Enviar al cliente"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons (Bottom) */}
      <div className="mt-6 flex items-center justify-between border-t border-[var(--color-border)] pt-6">
        <button
          onClick={() => dispatch({ type: "PREV_STEP" })}
          disabled={state.currentStep === 1 || state.isSubmitting}
          className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-sm text-[var(--color-text-primary)] bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-surface-elevated)] disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          <ArrowLeft className="w-4 h-4" /> Anterior
        </button>

        <button
          onClick={() => dispatch({ type: "NEXT_STEP" })}
          disabled={state.currentStep === 5 || !validateCurrentStep()}
          className="flex items-center gap-2 px-6 py-2 rounded-lg font-medium text-sm text-[#0a0a0a] bg-[var(--color-accent)] hover:bg-[#e5e5e5] border border-transparent disabled:opacity-30 disabled:cursor-not-allowed transition-colors">
          Siguiente <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
