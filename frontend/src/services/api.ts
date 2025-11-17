/**
 * API service for communicating with the Rock-Paper-Scissors backend.
 *
 * This module provides a clean, type-safe interface for all API operations.
 */

import axios, { AxiosInstance, AxiosError } from 'axios';
import type {
  PlayRequest,
  PlayResponse,
  ChoicesResponse,
  ErrorResponse,
} from '../types/game';

/**
 * Custom error class for API errors
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * API client for Rock-Paper-Scissors game
 */
class GameApiClient {
  private client: AxiosInstance;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError<ErrorResponse>) => {
        if (error.response) {
          // Server responded with error status
          throw new ApiError(
            error.response.data?.detail || 'An error occurred',
            error.response.status,
            error.response.data
          );
        } else if (error.request) {
          // Request made but no response received
          throw new ApiError('No response from server. Please check if the backend is running.');
        } else {
          // Something else happened
          throw new ApiError(error.message);
        }
      }
    );
  }

  /**
   * Play a round of Rock-Paper-Scissors
   *
   * @param choice - Player's choice (rock, paper, or scissors)
   * @returns Promise resolving to game result
   * @throws ApiError if request fails
   */
  async play(choice: PlayRequest['choice']): Promise<PlayResponse> {
    const response = await this.client.post<PlayResponse>('/api/v1/play', {
      choice,
    });
    return response.data;
  }

  /**
   * Get list of valid choices
   *
   * @returns Promise resolving to list of valid choices
   * @throws ApiError if request fails
   */
  async getChoices(): Promise<ChoicesResponse> {
    const response = await this.client.get<ChoicesResponse>('/api/v1/choices');
    return response.data;
  }

  /**
   * Health check
   *
   * @returns Promise resolving to true if API is healthy
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.client.get('/health');
      return true;
    } catch {
      return false;
    }
  }
}

// Export singleton instance
export const gameApi = new GameApiClient();

// Export class for testing
export { GameApiClient };
