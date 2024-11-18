# Makefile
start:
	# Remove all `.tmp` files
	rm -f *.tmp
	
	# Remove all `.log` files
	rm -f *.log
	
	# Delete all `.pyc` files
	find . -name "*.pyc" -delete
	
	# Start the Python HTTP server on port 1789
	python -m http.server 1789
