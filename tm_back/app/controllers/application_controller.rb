class ApplicationController < ActionController::API
    include Devise::Controllers::Helpers
    include Devise::Controllers::UrlHelpers
end