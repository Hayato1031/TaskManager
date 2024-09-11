class UserMailer < Devise::Mailer
    default template_path: 'devise/mailer' # Deviseのデフォルトテンプレートを使用
  
    # 確認メールの送信をカスタマイズ
    def confirmation_instructions(record, token, opts = {})
      # フロントエンドのURLを構築
      opts[:to] = record.email
      opts[:subject] = "アカウント確認のお願い"
      # Next.jsの確認URLに変更
      @confirmation_url = "#{ENV['FRONTEND_URL']}/account/verify?confirmation_token=#{token}"
      super
    end

    def reset_password_instructions(record, token, opts ={})
      opts[:to] = record.email
      opts[:subject] = "パスワードリセットのお知らせ"

      @edit_password_url = "#{ENV['FRONTEND_URL']}/account/reset_password_confirm?reset_password_token=#{token}"

      super
    end

  end