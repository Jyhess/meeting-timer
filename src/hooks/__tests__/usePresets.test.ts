import { renderHook } from '@testing-library/react';
import { usePresets } from '../usePresets';
import { act } from 'react';

// Mock AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
  setItem: jest.fn(),
  getItem: jest.fn(),
  removeItem: jest.fn(),
}));

// Mock zustand persist middleware
jest.mock('zustand/middleware', () => ({
  ...jest.requireActual('zustand/middleware'),
  persist: (config: any) => (set: any, get: any) => config(set, get),
}));

describe('usePresets', () => {
  beforeEach(() => {
    // Reset mocks and store
    jest.clearAllMocks();
    const { result } = renderHook(() => usePresets());
    act(() => {
      result.current.autoPresets = [];
      result.current.bookmarkedPresets = [];
    });
  });

  it('should initialize with empty lists', () => {
    const { result } = renderHook(() => usePresets());
    
    expect(result.current.autoPresets).toEqual([]);
    expect(result.current.bookmarkedPresets).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('should create an automatic preset', async () => {
    const { result } = renderHook(() => usePresets());
    
    await act(async () => {
      await result.current.createOrUpdatePreset(300, []); // 5 minutes without alerts
    });

    expect(result.current.autoPresets).toHaveLength(1);
    expect(result.current.autoPresets[0]).toMatchObject({
      seconds: 300,
      alerts: [],
      name: 'Timer 5:00',
      color: '',
      bookmarked: false
    });
  });

  it('should create a bookmarked preset', async () => {
    const { result } = renderHook(() => usePresets());
    
    await act(async () => {
      await result.current.createOrUpdatePreset(300, [], 'My Timer', '#FF0000');
    });

    expect(result.current.bookmarkedPresets).toHaveLength(1);
    expect(result.current.bookmarkedPresets[0]).toMatchObject({
      seconds: 300,
      alerts: [],
      name: 'My Timer',
      color: '#FF0000',
      bookmarked: true
    });
  });

  it('should limit to 2 automatic presets', async () => {
    const { result } = renderHook(() => usePresets());
    
    // Create three presets with different durations
    await act(async () => {
      await result.current.createOrUpdatePreset(300, []); // 5 minutes
    });

    await act(async () => {
      await result.current.createOrUpdatePreset(600, []); // 10 minutes
    });

    await act(async () => {
      await result.current.createOrUpdatePreset(900, []); // 15 minutes
    });

    expect(result.current.autoPresets).toHaveLength(2);
    expect(result.current.autoPresets[0].seconds).toBe(900); // Most recent
    expect(result.current.autoPresets[1].seconds).toBe(600); // Second most recent
  });

  it('should delete a preset', async () => {
    const { result } = renderHook(() => usePresets());
    
    await act(async () => {
      await result.current.createOrUpdatePreset(300, [], 'Timer to delete');
    });

    const presetId = result.current.bookmarkedPresets[0].id;

    await act(async () => {
      await result.current.removePreset(presetId);
    });

    expect(result.current.bookmarkedPresets).toHaveLength(0);
  });

  describe('Update and retrieval', () => {
    it('should retrieve a bookmarked preset by ID', async () => {
      const { result } = renderHook(() => usePresets());
      
      await act(async () => {
        await result.current.createOrUpdatePreset(300, [], 'Test Timer');
      });

      const presetId = result.current.bookmarkedPresets[0].id;
      const retrievedPreset = result.current.getPreset(presetId);

      expect(retrievedPreset).toBeDefined();
      expect(retrievedPreset?.name).toBe('Test Timer');
      expect(retrievedPreset?.seconds).toBe(300);
      expect(retrievedPreset?.alerts).toEqual([]);
      expect(retrievedPreset?.color).toBe('');
      expect(retrievedPreset?.bookmarked).toBe(true);
    });

    it('should retrieve an automatic preset by ID', async () => {
        const { result } = renderHook(() => usePresets());
        
        await act(async () => {
          await result.current.createOrUpdatePreset(300, []);
        });
  
        const presetId = result.current.autoPresets[0].id;
        const retrievedPreset = result.current.getPreset(presetId);
  
        expect(retrievedPreset).toBeDefined();
        expect(retrievedPreset?.name).toBe('Timer 5:00');
        expect(retrievedPreset?.seconds).toBe(300);
        expect(retrievedPreset?.alerts).toEqual([]);
        expect(retrievedPreset?.color).toBe('');
        expect(retrievedPreset?.bookmarked).toBe(false);
      });

    });

  describe('Duplicate handling', () => {
    it('should reuse an existing automatic preset with the same parameters and move it to the top of the list', async () => {
      const { result } = renderHook(() => usePresets());
      
      await act(async () => {
        await result.current.createOrUpdatePreset(300, [{ time: 150, type: 'vibrate' }]);
      });

      await act(async () => {
        await result.current.createOrUpdatePreset(600, []);
      });

      const firstLength = result.current.autoPresets.length;

      await act(async () => {
        // Create identical preset
        await result.current.createOrUpdatePreset(300, [{ time: 150, type: 'vibrate' }]);
      });

      expect(result.current.autoPresets.length).toBe(firstLength);
      expect(result.current.autoPresets[0].seconds).toBe(300);
      expect(result.current.autoPresets[1].seconds).toBe(600);
    });

    it('should reuse an existing bookmarked preset with the same name without changing order', async () => {
      const { result } = renderHook(() => usePresets());
      
      await act(async () => {
        await result.current.createOrUpdatePreset(300, [], 'Test Timer 300');
      });

      await act(async () => {
        await result.current.createOrUpdatePreset(600, [], 'Test Timer 600');
      });

      await act(async () => {
        await result.current.createOrUpdatePreset(900, [], 'Test Timer 900');
      });

      await act(async () => {
        await result.current.createOrUpdatePreset(600, [], 'Test Timer 600');
      });


      expect(result.current.bookmarkedPresets).toHaveLength(3);
      expect(result.current.bookmarkedPresets[0].name).toBe('Test Timer 900');
      expect(result.current.bookmarkedPresets[1].name).toBe('Test Timer 600');
      expect(result.current.bookmarkedPresets[2].name).toBe('Test Timer 300');
    });
  });
});
