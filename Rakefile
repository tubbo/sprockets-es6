require 'bundler/setup'
require 'rake/testtask'
require 'rubocop/rake_task'
require 'bundler/gem_tasks'

Rake::TestTask.new do |t|
  t.libs << 'test'
  t.warning = true
end

RuboCop::RakeTask.new :lint

task default: %i(lint test build)
