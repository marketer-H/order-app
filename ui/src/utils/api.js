// API 기본 설정
const API_BASE_URL = 'http://localhost:3000/api'

// API 호출 헬퍼 함수
async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
    },
  }
  
  const config = {
    ...defaultOptions,
    ...options,
    headers: {
      ...defaultOptions.headers,
      ...options.headers,
    },
  }
  
  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'API 요청 실패')
    }
    
    return await response.json()
  } catch (error) {
    console.error('API 요청 오류:', error)
    throw error
  }
}

// GET 요청
export async function get(endpoint) {
  return apiRequest(endpoint, { method: 'GET' })
}

// POST 요청
export async function post(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

// PATCH 요청
export async function patch(endpoint, data) {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  })
}

// DELETE 요청
export async function del(endpoint) {
  return apiRequest(endpoint, { method: 'DELETE' })
}

