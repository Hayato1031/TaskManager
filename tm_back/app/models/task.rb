class Task < ApplicationRecord
    belongs_to :user
    has_many :daily_reports, dependent: :destroy
end
