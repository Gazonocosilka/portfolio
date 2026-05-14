require 'socket'
require 'uri'

ROOT = '/Users/macbookpro/Documents/-/PORTFOLIO2'
PORT = 4201
MIME = {
  '.html' => 'text/html; charset=utf-8',
  '.css'  => 'text/css',
  '.js'   => 'application/javascript',
  '.json' => 'application/json',
  '.png'  => 'image/png',
  '.jpg'  => 'image/jpeg',
  '.svg'  => 'image/svg+xml',
  '.ico'  => 'image/x-icon',
}

server = TCPServer.new('127.0.0.1', PORT)
$stdout.puts "Serving #{ROOT} on port #{PORT}"
$stdout.flush

loop do
  client = server.accept
  req = client.gets
  next unless req
  method, path = req.split(' ')
  path = URI.decode_www_form_component(path.split('?').first || '/')
  path = '/index.html' if path == '/'
  file = ROOT + path
  ext  = File.extname(file)
  if File.file?(file) && file.start_with?(ROOT)
    body = File.binread(file)
    mime = MIME[ext] || 'application/octet-stream'
    client.print "HTTP/1.1 200 OK\r\nContent-Type: #{mime}\r\nContent-Length: #{body.bytesize}\r\nConnection: close\r\n\r\n"
    client.write body
  else
    client.print "HTTP/1.1 404 Not Found\r\nContent-Length: 9\r\nConnection: close\r\n\r\nNot Found"
  end
  client.close
rescue => e
  $stderr.puts e
  client&.close
end
