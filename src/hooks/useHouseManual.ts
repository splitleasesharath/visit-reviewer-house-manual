// ============================================================
// USE HOUSE MANUAL HOOK
// Split Lease Application - House Manual Data Hook
// ============================================================

import { useState, useEffect, useCallback } from 'react';
import { houseManualService } from '../services';
import { HouseManual, HouseManualSection, ApiError, DisplayMode } from '../types';

// ============================================================
// HOOK INTERFACE
// ============================================================

interface UseHouseManualOptions {
  houseManualId: string;
  accessToken?: string;
  autoFetch?: boolean;
}

interface UseHouseManualReturn {
  houseManual: HouseManual | null;
  sections: HouseManualSection[];
  isLoading: boolean;
  error: ApiError | null;
  refetch: () => Promise<void>;
  updateSection: (sectionId: string, updates: Partial<HouseManualSection>) => Promise<void>;
  toggleSection: (sectionId: string) => void;
  expandedSections: string[];
}

// ============================================================
// USE HOUSE MANUAL HOOK
// ============================================================

export const useHouseManual = ({
  houseManualId,
  accessToken,
  autoFetch = true,
}: UseHouseManualOptions): UseHouseManualReturn => {
  const [houseManual, setHouseManual] = useState<HouseManual | null>(null);
  const [sections, setSections] = useState<HouseManualSection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<ApiError | null>(null);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  // Fetch house manual data
  const fetchHouseManual = useCallback(async () => {
    if (!houseManualId) return;

    setIsLoading(true);
    setError(null);

    try {
      const manual = await houseManualService.getHouseManual(houseManualId, accessToken);
      setHouseManual(manual);

      // Set sections from manual or fetch separately
      if (manual.sections && manual.sections.length > 0) {
        setSections(manual.sections);
        // Initially expand first section
        if (manual.sections[0]) {
          setExpandedSections([manual.sections[0].id]);
        }
      } else {
        const fetchedSections = await houseManualService.getManualSections(houseManualId);
        setSections(fetchedSections);
        if (fetchedSections[0]) {
          setExpandedSections([fetchedSections[0].id]);
        }
      }
    } catch (err) {
      const apiError = err as ApiError;
      setError({
        code: apiError.code || 500,
        message: apiError.message || 'Failed to load house manual',
        details: apiError.details,
      });
    } finally {
      setIsLoading(false);
    }
  }, [houseManualId, accessToken]);

  // Auto-fetch on mount
  useEffect(() => {
    if (autoFetch) {
      fetchHouseManual();
    }
  }, [autoFetch, fetchHouseManual]);

  // Update a section
  const updateSection = useCallback(
    async (sectionId: string, updates: Partial<HouseManualSection>) => {
      if (!houseManualId) return;

      try {
        const updatedSection = await houseManualService.updateSection(
          houseManualId,
          sectionId,
          updates
        );

        setSections((prevSections) =>
          prevSections.map((section) =>
            section.id === sectionId ? { ...section, ...updatedSection } : section
          )
        );
      } catch (err) {
        const apiError = err as ApiError;
        setError({
          code: apiError.code || 500,
          message: apiError.message || 'Failed to update section',
        });
        throw err;
      }
    },
    [houseManualId]
  );

  // Toggle section expansion
  const toggleSection = useCallback((sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  }, []);

  return {
    houseManual,
    sections,
    isLoading,
    error,
    refetch: fetchHouseManual,
    updateSection,
    toggleSection,
    expandedSections,
  };
};

// ============================================================
// USE HOUSE MANUAL STATE HOOK
// ============================================================

interface UseHouseManualStateReturn {
  displayMode: DisplayMode;
  setDisplayMode: (mode: DisplayMode) => void;
  isEditing: boolean;
  startEditing: () => void;
  stopEditing: () => void;
  hasUnsavedChanges: boolean;
  setHasUnsavedChanges: (value: boolean) => void;
}

export const useHouseManualState = (
  initialMode: DisplayMode = DisplayMode.VIEW
): UseHouseManualStateReturn => {
  const [displayMode, setDisplayMode] = useState<DisplayMode>(initialMode);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);

  const isEditing = displayMode === DisplayMode.EDIT;

  const startEditing = useCallback(() => {
    setDisplayMode(DisplayMode.EDIT);
  }, []);

  const stopEditing = useCallback(() => {
    setDisplayMode(DisplayMode.VIEW);
    setHasUnsavedChanges(false);
  }, []);

  return {
    displayMode,
    setDisplayMode,
    isEditing,
    startEditing,
    stopEditing,
    hasUnsavedChanges,
    setHasUnsavedChanges,
  };
};

// ============================================================
// USE HOUSE MANUAL ACCESS HOOK
// ============================================================

interface UseHouseManualAccessReturn {
  hasAccess: boolean;
  permissions: string[];
  isValidating: boolean;
  accessError: string | null;
  validateAccess: () => Promise<boolean>;
}

export const useHouseManualAccess = (
  houseManualId: string,
  accessToken?: string,
  userId?: string
): UseHouseManualAccessReturn => {
  const [hasAccess, setHasAccess] = useState<boolean>(false);
  const [permissions, setPermissions] = useState<string[]>([]);
  const [isValidating, setIsValidating] = useState<boolean>(true);
  const [accessError, setAccessError] = useState<string | null>(null);

  const validateAccess = useCallback(async (): Promise<boolean> => {
    setIsValidating(true);
    setAccessError(null);

    try {
      // If access token provided, validate it
      if (accessToken) {
        const tokenResult = await houseManualService.validateAccessToken(
          houseManualId,
          accessToken
        );
        setHasAccess(tokenResult.isValid);
        if (!tokenResult.isValid) {
          setAccessError('Access link is invalid or expired');
        }
        return tokenResult.isValid;
      }

      // If user ID provided, check user access
      if (userId) {
        const accessResult = await houseManualService.checkAccess(houseManualId, userId);
        setHasAccess(accessResult.hasAccess);
        setPermissions(accessResult.permissions);
        if (!accessResult.hasAccess) {
          setAccessError('You do not have permission to access this manual');
        }
        return accessResult.hasAccess;
      }

      setAccessError('No authentication provided');
      return false;
    } catch (err) {
      const apiError = err as ApiError;
      setAccessError(apiError.message || 'Failed to validate access');
      setHasAccess(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  }, [houseManualId, accessToken, userId]);

  useEffect(() => {
    validateAccess();
  }, [validateAccess]);

  return {
    hasAccess,
    permissions,
    isValidating,
    accessError,
    validateAccess,
  };
};

export default useHouseManual;
