/**
 * Type definitions for Rock-Paper-Scissors game.
 *
 * These types match the backend API schema for type safety across the stack.
 */

/**
 * Valid game choices
 */
export type Choice = 'rock' | 'paper' | 'scissors';

/**
 * Possible game outcomes from player's perspective
 */
export type Outcome = 'win' | 'lose' | 'draw';

/**
 * Request payload for playing a game round
 */
export interface PlayRequest {
  choice: Choice;
}

/**
 * Response from playing a game round
 */
export interface PlayResponse {
  player_choice: Choice;
  computer_choice: Choice;
  outcome: Outcome;
  message: string;
}

/**
 * Response from choices endpoint
 */
export interface ChoicesResponse {
  choices: Choice[];
}

/**
 * Game statistics for tracking wins/losses/draws
 */
export interface GameStats {
  wins: number;
  losses: number;
  draws: number;
  total: number;
}

/**
 * Error response from API
 */
export interface ErrorResponse {
  detail: string;
}
