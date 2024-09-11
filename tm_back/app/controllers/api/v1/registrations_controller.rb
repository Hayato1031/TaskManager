module Api
    module V1
      class RegistrationsController < Devise::RegistrationsController
        respond_to :json
  
        private
  
        def respond_with(resource, _opts = {})
          if resource.persisted?
            render json: { success: true, user: resource }, status: :ok
          else
            render json: { success: false, errors: resource.errors.full_messages }, status: :unprocessable_entity
          end
        end
  
        def respond_to_on_destroy
          head :no_content
        end
      end
    end
end