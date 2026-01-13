'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Building2, Search, Send, Loader2, Check } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useSavedSuppliers, useSuppliers } from '@/lib/hooks/use-suppliers';
import type { Supplier } from '@/types/supplier';
import type { CreateConversationData } from '@/types/message';

interface NewConversationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateConversationData) => void;
  isSubmitting?: boolean;
  preselectedSupplierId?: number;
}

export function NewConversationDialog({
  open,
  onOpenChange,
  onSubmit,
  isSubmitting = false,
  preselectedSupplierId,
}: NewConversationDialogProps) {
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<'select' | 'compose'>(
    preselectedSupplierId ? 'compose' : 'select'
  );

  // Fetch saved suppliers for quick selection
  const { data: savedSuppliers = [] } = useSavedSuppliers();

  // Fetch all suppliers with search
  const { data: suppliersResponse } = useSuppliers({
    query: searchQuery || undefined,
    per_page: 10,
  });
  const allSuppliers = suppliersResponse?.data || [];

  // Find preselected supplier
  useEffect(() => {
    if (preselectedSupplierId && !selectedSupplier) {
      const supplier =
        savedSuppliers.find((s) => s.id === preselectedSupplierId) ||
        allSuppliers.find((s) => s.id === preselectedSupplierId);
      if (supplier) {
        setSelectedSupplier(supplier);
        setStep('compose');
      }
    }
  }, [preselectedSupplierId, savedSuppliers, allSuppliers, selectedSupplier]);

  // Reset form when dialog closes
  useEffect(() => {
    if (!open) {
      setSelectedSupplier(null);
      setSearchQuery('');
      setSubject('');
      setMessage('');
      setStep(preselectedSupplierId ? 'compose' : 'select');
    }
  }, [open, preselectedSupplierId]);

  const handleSelectSupplier = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setStep('compose');
  };

  const handleBack = () => {
    if (!preselectedSupplierId) {
      setStep('select');
    }
  };

  const handleSubmit = () => {
    if (!selectedSupplier || !message.trim()) return;

    onSubmit({
      supplier_id: selectedSupplier.id,
      subject: subject.trim() || undefined,
      initial_message: message.trim(),
    });
  };

  const canSubmit = selectedSupplier && message.trim().length > 0;

  // Combine and dedupe suppliers (saved first, then search results)
  const displaySuppliers = searchQuery
    ? allSuppliers
    : [...savedSuppliers, ...allSuppliers.filter(
        (s) => !savedSuppliers.find((saved) => saved.id === s.id)
      )];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg p-0">
        <DialogHeader className="border-b border-gray-100 px-6 py-4">
          <DialogTitle className="font-serif text-lg">
            {step === 'select' ? 'New Conversation' : 'Send Message'}
          </DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            {step === 'select'
              ? 'Select a supplier to start a conversation'
              : `Message to ${selectedSupplier?.company_name}`}
          </DialogDescription>
        </DialogHeader>

        {step === 'select' ? (
          <div className="px-6 py-4">
            {/* Search input */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search suppliers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 bg-gray-50 pl-9 text-sm focus:bg-white"
              />
            </div>

            {/* Supplier list */}
            <ScrollArea className="h-[300px]">
              {displaySuppliers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-center">
                  <Building2 className="mb-2 h-8 w-8 text-gray-300" />
                  <p className="text-sm text-gray-500">No suppliers found</p>
                </div>
              ) : (
                <div className="space-y-1">
                  {savedSuppliers.length > 0 && !searchQuery && (
                    <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-400">
                      Saved Suppliers
                    </p>
                  )}
                  {displaySuppliers.map((supplier) => (
                    <SupplierOption
                      key={supplier.id}
                      supplier={supplier}
                      isSelected={selectedSupplier?.id === supplier.id}
                      onSelect={() => handleSelectSupplier(supplier)}
                    />
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        ) : (
          <div className="px-6 py-4">
            {/* Selected supplier preview */}
            {selectedSupplier && !preselectedSupplierId && (
              <div className="mb-4">
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex w-full items-center gap-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-left transition-colors hover:bg-gray-100"
                >
                  <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                    {selectedSupplier.logo_url ? (
                      <Image
                        src={selectedSupplier.logo_url}
                        alt={selectedSupplier.company_name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-charcoal">
                      {selectedSupplier.company_name}
                    </p>
                    <p className="truncate text-xs text-gray-500">
                      {selectedSupplier.location}
                    </p>
                  </div>
                  <span className="text-xs text-agile-teal">Change</span>
                </button>
              </div>
            )}

            {/* Subject field */}
            <div className="mb-4">
              <Label htmlFor="subject" className="text-sm font-medium text-gray-700">
                Subject <span className="text-gray-400">(optional)</span>
              </Label>
              <Input
                id="subject"
                type="text"
                placeholder="e.g., Fabric inquiry for summer collection"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="mt-1.5 h-10 text-sm"
                maxLength={255}
              />
            </div>

            {/* Message field */}
            <div className="mb-6">
              <Label htmlFor="message" className="text-sm font-medium text-gray-700">
                Message
              </Label>
              <Textarea
                id="message"
                placeholder="Introduce yourself and describe what you're looking for..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1.5 min-h-[120px] resize-none text-sm"
                maxLength={5000}
              />
              <p className="mt-1 text-right text-xs text-gray-400">
                {message.length}/5000
              </p>
            </div>

            {/* Submit button */}
            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={!canSubmit || isSubmitting}
                className="gap-2 bg-agile-teal hover:bg-agile-teal/90"
              >
                {isSubmitting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
                Send Message
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

interface SupplierOptionProps {
  supplier: Supplier;
  isSelected: boolean;
  onSelect: () => void;
}

function SupplierOption({ supplier, isSelected, onSelect }: SupplierOptionProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-all',
        isSelected
          ? 'border-agile-teal bg-agile-teal/5'
          : 'border-transparent hover:bg-gray-50'
      )}
    >
      <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
        {supplier.logo_url ? (
          <Image
            src={supplier.logo_url}
            alt={supplier.company_name}
            fill
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
            <Building2 className="h-5 w-5 text-gray-400" />
          </div>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-charcoal">
          {supplier.company_name}
        </p>
        <p className="truncate text-xs text-gray-500">
          {supplier.service_type_label} · {supplier.location}
        </p>
      </div>
      {isSelected && (
        <div className="flex h-5 w-5 items-center justify-center rounded-full bg-agile-teal">
          <Check className="h-3 w-3 text-white" />
        </div>
      )}
    </button>
  );
}
