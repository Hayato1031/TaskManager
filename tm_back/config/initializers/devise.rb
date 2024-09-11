# frozen_string_literal: true

Devise.setup do |config|
  # メールの送信元アドレスの設定
  config.mailer_sender = ENV['GMAIL_USERNAME']

  # Deviseのコントローラー設定
  config.parent_controller = 'ApplicationController' # デフォルトでは'ApplicationController'

  # メーラー設定
  config.mailer = 'UserMailer'

  # Devise ORM設定
  require 'devise/orm/active_record'

  #　未認証でアカウントが使える期限
  config.allow_unconfirmed_access_for = 0.days

  # 認証期限
  config.confirm_within = 3.days

  # 認証キーの設定
  config.case_insensitive_keys = [:email]
  config.strip_whitespace_keys = [:email]

  # セッションのスキップ設定
  config.skip_session_storage = [:http_auth]

  # パスワードの設定
  config.stretches = Rails.env.test? ? 1 : 12
  config.password_length = 6..128
  config.email_regexp = /\A[^@\s]+@[^@\s]+\z/

  # 記憶トークンの有効期限
  config.expire_all_remember_me_on_sign_out = true

  # 確認機能の設定
  config.reconfirmable = true

  # パスワードリセットの有効期間
  config.reset_password_within = 6.hours

  # サインアウト時のHTTPメソッド
  config.sign_out_via = :delete

  # Hotwire/Turboの設定
  config.responder.error_status = :unprocessable_entity
  config.responder.redirect_status = :see_other
end