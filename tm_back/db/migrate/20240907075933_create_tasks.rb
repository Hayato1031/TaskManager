class CreateTasks < ActiveRecord::Migration[7.1]
  def change
    create_table :tasks, id: :uuid do |t|
      t.string :title, null: false
      t.string :member, null: false
      t.string :goal
      t.text :description
      t.boolean :status, default: true
      t.references :user, null: false, foreign_key: true
      t.timestamps
    end
  end
end
