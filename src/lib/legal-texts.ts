export const legalTexts = {
  es: {
    contract: {
      type_label: "Contrato de Prestación de Servicios Profesionales",
      provider: "Prestador",
      client: "Cliente",
      tax_id: "RFC",
      address: "Dirección",
      not_specified: "No especificada",
      draft_badge: "Borrador de Contrato",
      signed_badge: "Documento Firmado",
      signed_success: "Contrato Firmado Correctamente",
      signed_by_info: "Firmado por {name} el {date}.",
      contract_number: "Contrato #{slug}",
      sections: {
        project: {
          title: "1. El Proyecto",
          content: "Este contrato vincula a las partes para la ejecución del proyecto: {project_name}. Los servicios descritos a continuación serán realizados bajo los estándares de calidad de Noctra Studio:"
        },
        financial: {
          title: "2. Términos Económicos",
          content: "La inversión total estipulada para este proyecto es de {total}. El Cliente se compromete a realizar los pagos según el siguiente calendario:"
        },
        timeline: {
          title: "3. Tiempos y Calendario",
          content: "El proyecto tiene una duración estimada de {total_weeks} semanas. Se ha incluido un periodo de amortiguación (buffer) para garantizar la calidad final de los entregables.",
          start_date: "Fecha de Inicio",
          end_date: "Entrega Estimada"
        },
        legal_terms: {
          title: "4. Términos Legales y Condiciones",
          confidentiality: "Confidencialidad",
          confidentiality_text: "Ambas partes se comprometen a tratar como confidencial toda la información compartida durante el proyecto y no divulgarla a terceros sin consentimiento previo por escrito.",
          intellectual_property: "Propiedad Intelectual",
          intellectual_property_text: "Al recibir el pago total de la inversión acordada, la propiedad intelectual de los entregables finales pasará a ser del Cliente. Hasta que el pago no sea liquidado en su totalidad, Noctra Studio retiene los derechos sobre todos los materiales creados.",
          late_payments: "Pagos Atrasados y Suspensión",
          late_payments_text: "Los pagos atrasados por más de 5 días hábiles causarán un cargo moratorio del 5% mensual o fracción. Noctra Studio se reserva el derecho de suspender la prestación del servicio hasta que los pagos atrasados sean liquidados.",
          scope_changes: "Cambios de Alcance",
          scope_changes_text: "Cualquier solicitud que modifique, añada o altere sustancialmente el alcance de los servicios descritos en este documento (Sección 1), será considerada un Cambio de Alcance. Noctra Studio evaluará estos cambios y, de ser necesario, emitirá una cotización adicional que deberá ser aprobada por el Cliente antes de su ejecución.",
          liability: "Limitación de Responsabilidad",
          liability_text: "En ningún caso la responsabilidad total de Noctra Studio hacia el Cliente por cualquier reclamación, daño o pérdida derivada de este contrato excederá el monto total efectivamente pagado por el Cliente bajo este contrato por los servicios específicos que causaron la reclamación. Noctra Studio no será responsable por daños indirectos, incidentales o lucro cesante." // Stronger liability limit
        }
      },
      signature: {
        digitally_signed: "Documento Firmado Digitalmente",
        identity_verified: "Identidad Verificada",
        fingerprint: "Huella Digital"
      },
      actions: {
        ready: "¿Todo listo para empezar?",
        ready_desc: "Al firmar este contrato confirmas tu acuerdo con los términos, plazos e inversión descritos.",
        sign_btn: "Firmar contrato digitalmente",
        download_btn: "Descargar Copia PDF",
        modal_title: "Firma del Documento",
        modal_desc: "Por seguridad, escribe tu nombre completo tal como aparecerá en el documento legal.",
        name_placeholder: "Ej: Juan Pérez López",
        legal_warning: "Esta es una firma electrónica con validez legal. Al confirmar, tu nombre y marca de tiempo se grabarán permanentemente en el contrato.",
        confirm_btn: "Confirmar Firma Digital",
        loading: "Procesando..."
      }
    },
    cancellation: {
      type_label: "Acuerdo de Cancelación y Terminación Anticipada",
      badge: "Cancelación Pendiente",
      signed_badge: "Terminación Acordada",
      signed_success: "El acuerdo de cancelación ha sido firmado exitosamente.",
      sections: {
        agreement: {
          title: "1. Terminación del Contrato Base",
          content: "Por medio del presente documento, las partes acuerdan la terminación anticipada y cancelación definitiva del contrato original correspondiente al proyecto: {project_name} (ID: {slug})."
        },
        financial: {
          title: "2. Obligaciones Financieras y Penalización (Cancellation Fee)",
          content: "En virtud de la cancelación anticipada del proyecto, el Cliente reconoce y acuerda pagar una penalización (Cancellation Fee) por los servicios ya ejecutados, lucro cesante o gastos incurridos por Noctra Studio hasta la fecha de terminación, por el monto fijo de:",
          fee_amount: "Cuota de Cancelación (MXN)",
          fee_terms: "Términos del pago: {terms}",
          mutual_release: "3. Liberación Mutua",
          mutual_release_text: "Con el pago de la Cuota de Cancelación, las partes se liberan mutua y recíprocamente de cualquier reclamación, derecho o acción derivada del Contrato Original, renunciando el Cliente al derecho de recibir cualquier entregable final asociado al proyecto, salvo acuerdo expreso en este documento."
        }
      },
      actions: {
        ready: "Firma del Acuerdo de Cancelación",
        ready_desc: "Al firmar este acuerdo, aceptas la terminación del contrato y el pago de la cuota de penalización estipulada.",
        sign_btn: "Aceptar Términos y Firmar",
      }
    }
  },
  en: {
    contract: {
      type_label: "Professional Services Agreement",
      provider: "Service Provider",
      client: "Client",
      tax_id: "Tax ID (RFC)",
      address: "Address",
      not_specified: "Not specified",
      draft_badge: "Contract Draft",
      signed_badge: "Signed Document",
      signed_success: "Contract Successfully Signed",
      signed_by_info: "Signed by {name} on {date}.",
      contract_number: "Contract #{slug}",
      sections: {
        project: {
          title: "1. The Project",
          content: "This contract binds the parties for the execution of the project: {project_name}. The services described below will be delivered under Noctra Studio's quality standards:"
        },
        financial: {
          title: "2. Financial Terms",
          content: "The total investment for this project is {total}. The Client agrees to make payments according to the following schedule:"
        },
        timeline: {
          title: "3. Timeline and Delivery",
          content: "The project has an estimated duration of {total_weeks} weeks. A buffer period has been included to ensure the final quality of the deliverables.",
          start_date: "Start Date",
          end_date: "Estimated Delivery"
        },
        legal_terms: {
          title: "4. Legal Terms and Conditions",
          confidentiality: "Confidentiality",
          confidentiality_text: "Both parties agree to treat all information shared during the project as confidential and not to disclose it to third parties without prior written consent.",
          intellectual_property: "Intellectual Property",
          intellectual_property_text: "Upon receipt of full payment for the agreed investment, the intellectual property of the final deliverables shall transfer to the Client. Noctra Studio retains rights to all created materials until full payment is settled.",
          late_payments: "Late Payments & Suspension",
          late_payments_text: "Payments delayed for more than 5 business days will incur a late fee of 5% per month or fraction thereof. Noctra Studio reserves the right to suspend the provision of services until all overdue payments are cleared.",
          scope_changes: "Scope Changes",
          scope_changes_text: "Any request that modifies, adds, or substantially alters the scope of services described in this document (Section 1) shall be considered a Scope Change. Noctra Studio will evaluate these changes and, if necessary, issue an additional quote that must be approved by the Client prior to execution.",
          liability: "Limitation of Liability",
          liability_text: "In no event shall Noctra Studio's total liability to the Client for any claim, damage, or loss arising from this contract exceed the total amount actually paid by the Client under this contract for the specific services that caused the claim. Noctra Studio shall not be liable for any indirect, incidental, or consequential damages."
        }
      },
      signature: {
        digitally_signed: "Digitally Signed Document",
        identity_verified: "Identity Verified",
        fingerprint: "Digital Fingerprint"
      },
      actions: {
        ready: "Ready to get started?",
        ready_desc: "By signing this contract, you confirm your agreement with the terms, timeline, and investment described.",
        sign_btn: "Digitally sign contract",
        download_btn: "Download PDF Copy",
        modal_title: "Document Signature",
        modal_desc: "For security purposes, type your full name exactly as it will appear on the legal document.",
        name_placeholder: "Ex: John Doe",
        legal_warning: "This is a legally binding electronic signature. Upon confirming, your name and a timestamp will be permanently recorded on the contract.",
        confirm_btn: "Confirm Digital Signature",
        loading: "Processing..."
      }
    },
    cancellation: {
      type_label: "Cancellation and Early Termination Agreement",
      badge: "Pending Cancellation",
      signed_badge: "Agreed Termination",
      signed_success: "The cancellation agreement has been successfully signed.",
      sections: {
        agreement: {
          title: "1. Base Contract Termination",
          content: "By means of this document, the parties agree to the early termination and definitive cancellation of the original contract corresponding to the project: {project_name} (ID: {slug})."
        },
        financial: {
          title: "2. Financial Obligations & Cancellation Fee",
          content: "In virtue of the early cancellation of the project, the Client acknowledges and agrees to pay a Cancellation Fee for the services already rendered, lost profits, or expenses incurred by Noctra Studio up to the termination date, for the fixed amount of:",
          fee_amount: "Cancellation Fee",
          fee_terms: "Payment terms: {terms}",
          mutual_release: "3. Mutual Release",
          mutual_release_text: "Upon payment of the Cancellation Fee, the parties mutually release and discharge each other from any claim, right, or action arising from the Original Contract, with the Client waiving the right to receive any final deliverables associated with the project, unless expressly agreed in this document."
        }
      },
      actions: {
        ready: "Sign Cancellation Agreement",
        ready_desc: "By signing this agreement, you accept the termination of the contract and the payment of the stipulated cancellation fee.",
        sign_btn: "Accept Terms and Sign",
      }
    }
  }
};
