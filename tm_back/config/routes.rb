# config/routes.rb
Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    namespace :v1 do
      devise_for :users, controllers: {
        confirmations: 'api/v1/confirmations',
        passwords: 'api/v1/passwords',
        registrations: 'api/v1/registrations'
      }
      post "/register", to: "auth#register"
      post "/login", to: "auth#login"
      get 'auth/validate_token', to: 'auth#validate_token'
      resources :users, only: [] do
        patch 'update_username', on: :collection
        patch 'update_email', on: :collection
        patch 'update_password', on: :collection
        delete 'destroy', on: :collection
      end

      resources :tasks
      resources :daily_reports
      resources :comments
    end
  end
end