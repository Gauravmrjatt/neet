'use client'

import { useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface PredictorLeaveWarningProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirmLeave: () => void
}

export function PredictorLeaveWarning({
  open,
  onOpenChange,
  onConfirmLeave,
}: PredictorLeaveWarningProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary-navy">Leaving so soon?</DialogTitle>
          <DialogDescription className="pt-2 leading-relaxed">
            Your prediction results will be permanently lost. If you leave or refresh this page,
            you'll need to{' '}
            <span className="font-semibold text-destructive">purchase a new plan</span> to view
            predictions again.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="border-primary-navy/30 text-primary-navy hover:bg-primary-navy/5"
          >
            Stay on Page
          </Button>
          <Button
            variant="destructive"
            onClick={onConfirmLeave}
          >
            Leave Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export function useLeaveWarning(active: boolean) {
  const router = useRouter()

  const handleBeforeUnload = useCallback(
    (e: BeforeUnloadEvent) => {
      if (active) {
        e.preventDefault()
        e.returnValue = ''
      }
    },
    [active],
  )

  useEffect(() => {
    if (active) {
      window.addEventListener('beforeunload', handleBeforeUnload)
    }
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [active, handleBeforeUnload])
}
