-- Add performance indexes for existing tables

-- Product reviews indexes
CREATE INDEX IF NOT EXISTS idx_product_reviews_product_composite ON product_reviews(product_id, product_type);
CREATE INDEX IF NOT EXISTS idx_product_reviews_user_id ON product_reviews(user_id);

-- Bank reviews indexes
CREATE INDEX IF NOT EXISTS idx_bank_reviews_bank_id ON bank_reviews(bank_id);
CREATE INDEX IF NOT EXISTS idx_bank_reviews_user_id ON bank_reviews(user_id);

-- Alerts indexes
CREATE INDEX IF NOT EXISTS idx_alerts_user_active ON alerts(user_id, is_active);
CREATE INDEX IF NOT EXISTS idx_alerts_target ON alerts(target_id);

-- Notifications indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_read ON notifications(user_id, is_read);
CREATE INDEX IF NOT EXISTS idx_notifications_alert_id ON notifications(alert_id);