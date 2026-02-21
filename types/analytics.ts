/**
 * Analytics Event Types
 * Centralized type definitions for analytics tracking
 */

// Event Categories
export enum AnalyticsEventCategory {
    PAGE_VIEW = 'page_view',
    USER_ACTION = 'user_action',
    FEATURE_USAGE = 'feature_usage',
    ENGAGEMENT = 'engagement',
    CONVERSION = 'conversion',
}

// Event Names
export enum AnalyticsEvent {
    // Page Views
    HOME_PAGE_VIEWED = 'home_page_viewed',
    BRAND_PAGE_VIEWED = 'brand_page_viewed',
    MODEL_PAGE_VIEWED = 'model_page_viewed',
    VARIANT_PAGE_VIEWED = 'variant_page_viewed',
    COMPARISON_PAGE_VIEWED = 'comparison_page_viewed',
    PRICE_BREAKUP_VIEWED = 'price_breakup_viewed',
    NEWS_PAGE_VIEWED = 'news_page_viewed',
    SEARCH_PAGE_VIEWED = 'search_page_viewed',

    // Car Interactions
    CAR_CARD_CLICKED = 'car_card_clicked',
    CAR_IMAGE_VIEWED = 'car_image_viewed',
    CAR_SPECS_VIEWED = 'car_specs_viewed',
    CAR_FAVORITED = 'car_favorited',
    CAR_UNFAVORITED = 'car_unfavorited',

    // Comparison Features
    COMPARISON_STARTED = 'comparison_started',
    COMPARISON_COMPLETED = 'comparison_completed',
    COMPARISON_CAR_ADDED = 'comparison_car_added',
    COMPARISON_CAR_REMOVED = 'comparison_car_removed',

    // Search & Filters
    SEARCH_PERFORMED = 'search_performed',
    FILTER_APPLIED = 'filter_applied',
    FILTER_CLEARED = 'filter_cleared',

    // AI Features
    AI_CHAT_OPENED = 'ai_chat_opened',
    AI_CHAT_MESSAGE_SENT = 'ai_chat_message_sent',
    AI_CHAT_CLOSED = 'ai_chat_closed',
    AI_SEARCH_PERFORMED = 'ai_search_performed',

    // Price & EMI
    PRICE_BREAKUP_CALCULATED = 'price_breakup_calculated',
    EMI_CALCULATED = 'emi_calculated',
    LOCATION_CHANGED = 'location_changed',

    // User Actions
    USER_REGISTERED = 'user_registered',
    USER_LOGGED_IN = 'user_logged_in',
    USER_LOGGED_OUT = 'user_logged_out',

    // Engagement
    SCROLL_DEPTH = 'scroll_depth',
    TIME_ON_PAGE = 'time_on_page',
    EXTERNAL_LINK_CLICKED = 'external_link_clicked',
}

// Event Properties
export interface BaseEventProperties {
    timestamp?: number;
    page_url?: string;
    page_title?: string;
    user_id?: string;
    session_id?: string;
}

export interface CarEventProperties extends BaseEventProperties {
    car_id?: string;
    brand?: string;
    model?: string;
    variant?: string;
    price?: number;
    fuel_type?: string;
    transmission?: string;
}

export interface SearchEventProperties extends BaseEventProperties {
    search_query: string;
    search_type?: 'text' | 'ai' | 'filter';
    results_count?: number;
}

export interface ComparisonEventProperties extends BaseEventProperties {
    car_ids: string[];
    brands: string[];
    models: string[];
    comparison_type?: 'side_by_side' | 'detailed';
}

export interface PriceEventProperties extends BaseEventProperties {
    car_id: string;
    variant_id?: string;
    location: string;
    on_road_price?: number;
    ex_showroom_price?: number;
}

export interface AIEventProperties extends BaseEventProperties {
    message?: string;
    intent?: string;
    response_time?: number;
    suggestions_shown?: number;
}

export interface EMIEventProperties extends BaseEventProperties {
    loan_amount: number;
    interest_rate: number;
    tenure_years: number;
}

export interface FilterEventProperties extends BaseEventProperties {
    filter_type: string;
    filter_value: string | number;
    active_filters?: Record<string, any>;
}

export interface EngagementEventProperties extends BaseEventProperties {
    scroll_percentage?: number;
    time_spent_seconds?: number;
    link_url?: string;
    link_text?: string;
}

// User Properties
export interface UserProperties {
    user_id?: string;
    email?: string;
    name?: string;
    registration_date?: string;
    favorite_brands?: string[];
    search_history_count?: number;
    comparison_count?: number;
    last_active?: string;
}

// Analytics Configuration
export interface AnalyticsConfig {
    googleAnalyticsId?: string;
    clarityId?: string;
    amplitudeApiKey?: string;
    debug?: boolean;
    enabled?: boolean;
}

// Platform-specific types
export type AnalyticsEventProperties =
    | BaseEventProperties
    | CarEventProperties
    | SearchEventProperties
    | ComparisonEventProperties
    | PriceEventProperties
    | EMIEventProperties
    | AIEventProperties
    | FilterEventProperties
    | EngagementEventProperties;
