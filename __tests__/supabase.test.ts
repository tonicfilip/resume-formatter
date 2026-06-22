// Mock supabase admin client before importing the module
const mockSingle   = jest.fn()
const mockUpdate   = jest.fn()
const mockUpsert   = jest.fn()
const mockEq       = jest.fn()
const mockSelect   = jest.fn()
const mockFrom     = jest.fn()

jest.mock('@supabase/supabase-js', () => ({
  createClient: jest.fn(() => ({
    from: mockFrom,
  })),
}))

// Set required env vars
process.env.NEXT_PUBLIC_SUPABASE_URL       = 'https://test.supabase.co'
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY  = 'anon-key'
process.env.SUPABASE_SERVICE_ROLE_KEY      = 'service-role-key'

import { getUser, isUserPaid, markUserPaid } from '../lib/supabase'

describe('Supabase helpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    // Chain: from().select().eq().single()
    mockSingle.mockResolvedValue({ data: null, error: null })
    mockEq.mockReturnValue({ single: mockSingle })
    mockSelect.mockReturnValue({ eq: mockEq })
    mockUpdate.mockReturnValue({ eq: jest.fn().mockResolvedValue({ error: null }) })
    mockUpsert.mockResolvedValue({ error: null })
    mockFrom.mockReturnValue({
      select: mockSelect,
      upsert: mockUpsert,
      update: mockUpdate,
    })
  })

  describe('getUser', () => {
    it('returns null when user does not exist', async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: 'not found' } })
      const result = await getUser('clerk_123')
      expect(result).toBeNull()
    })

    it('returns user data when user exists', async () => {
      const mockUser = { id: 'clerk_123', email: 'test@test.com', paid: false }
      mockSingle.mockResolvedValue({ data: mockUser, error: null })
      const result = await getUser('clerk_123')
      expect(result).toEqual(mockUser)
    })
  })

  describe('isUserPaid', () => {
    it('returns false when user does not exist', async () => {
      mockSingle.mockResolvedValue({ data: null, error: { message: 'not found' } })
      expect(await isUserPaid('clerk_123')).toBe(false)
    })

    it('returns false when user.paid is false', async () => {
      mockSingle.mockResolvedValue({ data: { paid: false }, error: null })
      expect(await isUserPaid('clerk_123')).toBe(false)
    })

    it('returns true when user.paid is true', async () => {
      mockSingle.mockResolvedValue({ data: { paid: true }, error: null })
      expect(await isUserPaid('clerk_123')).toBe(true)
    })
  })

  describe('markUserPaid', () => {
    it('calls update with paid=true and the order id', async () => {
      const eqMock = jest.fn().mockResolvedValue({ error: null })
      mockUpdate.mockReturnValue({ eq: eqMock })

      await markUserPaid('clerk_123', 'order_456')

      expect(mockUpdate).toHaveBeenCalledWith(
        expect.objectContaining({ paid: true, order_id: 'order_456' })
      )
      expect(eqMock).toHaveBeenCalledWith('id', 'clerk_123')
    })

    it('throws when db update fails', async () => {
      const eqMock = jest.fn().mockResolvedValue({ error: { message: 'db error' } })
      mockUpdate.mockReturnValue({ eq: eqMock })
      await expect(markUserPaid('clerk_123', 'order_456')).rejects.toThrow('db error')
    })
  })
})
