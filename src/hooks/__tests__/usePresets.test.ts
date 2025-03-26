import { renderHook } from '@testing-library/react';
import { usePresets } from '../usePresets';

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

describe('new usePresets', () => {

  jest.clearAllMocks();
  usePresets.setState({
    autoPresets: [],
    bookmarkedPresets: [],
    isLoading: false
  });

  it('should initialize with empty lists', () => {
    const { result } = renderHook(() => usePresets());
    
    expect(result.current.autoPresets).toEqual([]);
    expect(result.current.bookmarkedPresets).toEqual([]);
    expect(result.current.isLoading).toBe(false);
  });

  describe('loadPresets', () => {
    it('should load presets and update loading state', async () => {
      const { loadPresets } = usePresets.getState();
      await loadPresets();
      expect(usePresets.getState().isLoading).toBe(false);
    });
  });
});

describe('usePresets with exsiting presets', () => {
  const auto1 = {
    id: 'auto1',
    name: 'Auto 1',
    seconds: 300,
    alerts: [],
    created_at: new Date().toISOString(),
    last_used: new Date().toISOString(),
    color: '',
    bookmarked: false
  };
  const auto2 = {
    id: 'auto2',
    name: 'Auto 2',
    seconds: 600,
    alerts: [],
    created_at: new Date().toISOString(),
    last_used: new Date().toISOString(),
    color: '',
    bookmarked: false
  };
  const book1 = {
    id: 'book1',
    name: 'Bookmarked 1',
    seconds: 900,
    alerts: [],
    created_at: new Date().toISOString(),
    last_used: new Date().toISOString(),
    color: '',
    bookmarked: true
  };
  const book2 = {
    id: 'book2',
    name: 'Bookmarked 2',
    seconds: 1200,
    alerts: [],
    created_at: new Date().toISOString(),
    last_used: new Date().toISOString(),
    color: '',
    bookmarked: true
  };
  const book3 = {
    id: 'book3',
    name: 'Bookmarked 3',
    seconds: 1800,
    alerts: [],
    created_at: new Date().toISOString(),
    last_used: new Date().toISOString(),
    color: '',
    bookmarked: true
  };

  beforeEach(() => {
    // Reset mocks and store
    jest.clearAllMocks();
    usePresets.setState({
      autoPresets: [auto1, auto2],
      bookmarkedPresets: [book1, book2, book3],
      isLoading: false
    });
  });

  describe('getPreset', () => {
    it('should return undefined when preset not found', () => {
      const { getPreset } = usePresets.getState();
      expect(getPreset('non-existent')).toBeUndefined();
    });

    it('should find preset in autoPresets by Id', () => {
      const { getPreset } = usePresets.getState();
      expect(getPreset('auto2')).toEqual(auto2);
    });

    it('should find preset in bookmarkedPresets by Id', () => {
      const { getPreset } = usePresets.getState();
      expect(getPreset('book2')).toEqual(book2);
    });
  });

  describe('createOrUpdatePreset', () => {
    it('should create a new auto preset', async () => {
      const { createOrUpdatePreset } = usePresets.getState();
      await createOrUpdatePreset(60, []);
      const state = usePresets.getState();
      expect(state.autoPresets).toHaveLength(2);
      expect(state.autoPresets[0].seconds).toBe(60);
    });

    it('should reuse an existing automatic preset with the same parameters and move it to the top of the list', async () => {
      const {createOrUpdatePreset } = usePresets.getState();

      await createOrUpdatePreset(600, []);

      const state = usePresets.getState();
      expect(state.autoPresets.length).toBe(2);
      expect(state.autoPresets[0].seconds).toBe(600);
      expect(state.autoPresets[1].id).toBe('auto1');
    });

    it('should check alarms to compare automatic preset with the same parameters and move it to the top of the list', async () => {
      const {createOrUpdatePreset } = usePresets.getState();
      
      await createOrUpdatePreset(300, [{ time: 150, type: 'vibrate' }]);

      let state = usePresets.getState();
      expect(state.autoPresets.length).toBe(2);
      expect(state.autoPresets[0].seconds).toBe(300);
      expect(state.autoPresets[0].alerts).toEqual([{ time: 150, type: 'vibrate' }]);
      expect(state.autoPresets[1].id).toBe('auto1');

      await createOrUpdatePreset(300, []);
      
      state = usePresets.getState();
      expect(state.autoPresets[0].seconds).toBe(300);
      expect(state.autoPresets[0].alerts).toEqual([]);
      expect(state.autoPresets[1].seconds).toBe(300);
      expect(state.autoPresets[1].alerts).toEqual([{ time: 150, type: 'vibrate' }]);
    });

    it('should create a new bookmarked preset', async () => {
      const { createOrUpdatePreset } = usePresets.getState();
      await createOrUpdatePreset(60, [], 'Test Preset');
      const state = usePresets.getState();
      expect(state.bookmarkedPresets).toHaveLength(4);
      expect(state.bookmarkedPresets[0].name).toBe('Test Preset');
      expect(state.bookmarkedPresets[0].seconds).toBe(60);
      expect(state.bookmarkedPresets[0].alerts).toEqual([]);

    });

    it('should reuse an existing bookmarked preset with the same name without changing order nor ID', async () => {
      const {createOrUpdatePreset } = usePresets.getState();

      await createOrUpdatePreset(60, [], 'Bookmarked 2', '#FF0000');

      const state = usePresets.getState();

      expect(state.bookmarkedPresets).toHaveLength(3);
      expect(state.bookmarkedPresets[0].id).toBe('book1');
      expect(state.bookmarkedPresets[1].id).toBe('book2');
      expect(state.bookmarkedPresets[1].seconds).toBe(60);
      expect(state.bookmarkedPresets[1].color).toBe('#FF0000');
      expect(state.bookmarkedPresets[2].id).toBe('book3');
    });

    it('should limit to 2 automatic presets', async () => {
      const {createOrUpdatePreset } = usePresets.getState();

      await createOrUpdatePreset(60, []); // 5 minutes

      const state = usePresets.getState();
      expect(state.autoPresets).toHaveLength(2);
      expect(state.autoPresets[0].seconds).toBe(60);
      expect(state.autoPresets[1].seconds).toBe(300);
    });
  });

  describe('updatePreset', () => {
    it('should update auto preset', async () => {
      const { updatePreset } = usePresets.getState();
      await updatePreset({ ...auto1, seconds: 120 });
      const state = usePresets.getState();
      expect(state.autoPresets[0].seconds).toBe(120);
    });

    it('should update bookmarked preset without changing order nor ID', async () => {
      const { updatePreset } = usePresets.getState();
      await updatePreset({ ...book2, seconds: 120 });
      const state = usePresets.getState();
      expect(state.bookmarkedPresets[0].id).toBe('book1');
      expect(state.bookmarkedPresets[1].id).toBe('book2');
      expect(state.bookmarkedPresets[1].seconds).toBe(120);
      expect(state.bookmarkedPresets[2].id).toBe('book3');
    });
  });

  describe('removePreset', () => {
    it('should remove auto preset', async () => {
      const { removePreset } = usePresets.getState();
      await removePreset('auto1');
      const state = usePresets.getState();
      expect(state.autoPresets).toHaveLength(1);
      expect(state.autoPresets[0].id).toBe('auto2');
    });

    it('should remove bookmarked preset', async () => {
      const { removePreset } = usePresets.getState();
      await removePreset('book1');
      const state = usePresets.getState();
      expect(state.bookmarkedPresets).toHaveLength(2);
      expect(state.bookmarkedPresets[0].id).toBe('book2');
      expect(state.bookmarkedPresets[1].id).toBe('book3');
    });
  });

  describe('reorderBookmarkedPresets', () => {
    it('should reorder bookmarked presets', () => {
      const { reorderBookmarkedPresets } = usePresets.getState();
      reorderBookmarkedPresets([book2, book1, book3]);
      const state = usePresets.getState();
      expect(state.bookmarkedPresets[0].id).toBe('book2');
      expect(state.bookmarkedPresets[1].id).toBe('book1');
      expect(state.bookmarkedPresets[2].id).toBe('book3');
    });
  });
});
