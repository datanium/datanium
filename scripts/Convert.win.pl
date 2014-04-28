#!D:\Perl64\bin\perl.exe

use strict;
use Text::CSV;

# loading the files to cache
# normal var
my $input;
my $dataOutput;
my $controlOutput;
my $line;
my @fieldsInLine;

# data var
my %DataByCountry;
my %Indicators;
my $countryNameOffset;
my $indicatorNameOffset;
my $indicatorCodeOffset;
my $yearOffset=0;
my @years;
my @countries;
#data temp var
my $country;
my $year;
my $indicatorCode;
my $indicatorName;
my $value;
my %DataByCountryYear;
my @row;

($input,$dataOutput,$controlOutput)=@ARGV;

if (!open (INPUT, $input)){
	die "cannot open file $input , $!";
}

#first line is header
$line=<INPUT>;
@fieldsInLine=split(',',$line);

my $Offset=0;
foreach (@fieldsInLine){
	if ($_ =~ m/Contry Name/){
		$countryNameOffset=$Offset;
	}
	if ($_ =~ m/Indicator Name/){
		$indicatorNameOffset=$Offset;
	}
	if ($_ =~ m/Indicator Code/){
		$indicatorCodeOffset=$Offset;
	}
	if ($_ =~ m/\d{4}/ ){
		push (@years,$_);
		$yearOffset=$Offset if $yearOffset eq 0;
	}
	$Offset++;
}
close (INPUT);

# start reading CSV
my $csv = Text::CSV->new ( { binary => 1 } )  # should set binary attribute.
	or die "Cannot use CSV: ".Text::CSV->error_diag ();
open my $fh, "<:encoding(utf8)", $input or die "$input: $!";

my $lineNumber=0;
while (my $fieldsInLine = $csv->getline($fh)){
	if ($lineNumber ne 0){
		#print "Country : $fieldsInLine->[$countryNameOffset]\t\t";
		#print "Indicator: $fieldsInLine->[$indicatorNameOffset]\t $fieldsInLine->[$indicatorCodeOffset]\n";
		#print "First Year value: $fieldsInLine->[$yearOffset]\n";
		$country=$fieldsInLine->[$countryNameOffset];
		$indicatorCode=$fieldsInLine->[$indicatorCodeOffset];
		$indicatorName=$fieldsInLine->[$indicatorNameOffset];
		#replace '.' with '_' as mongo db doesn't accetp '.' inside keys
		$indicatorCode=~ s/\./_/g;
		
		$Indicators{$indicatorCode}=$indicatorName;
		push (@countries, $country) unless grep { $_ eq $country} @countries;
			
		$Offset=0;
		foreach $year(@years) {
			$value=$fieldsInLine->[$yearOffset+$Offset];
			if ($value =~ m/E[-+]/){
				$value=$value*1;
			}
			$DataByCountry{$country}->{$year}->{$indicatorCode}=$value;
			$Offset++;
		}
	}
	$lineNumber++;
}
print "Line Number with header: $lineNumber ";
$csv->eof or $csv->error_diag();
close $fh;

#write to a data file
open $fh, ">:encoding(utf8)", "$dataOutput" or die "$dataOutput: $!";
$csv->eol("\n");
push (@row, "country");
push (@row, "year");
push (@row, keys (%Indicators));
$csv->print ($fh, \@row);

foreach $country (@countries){
	foreach $year(@years){
		@row=();
		push (@row, $country);
		push (@row, $year);
		foreach $indicatorCode (keys (%Indicators)){
			#push (@row, $indicatorCode);
			push (@row, $DataByCountry{$country}->{$year}->{$indicatorCode});
		}
		$csv->print ($fh, \@row);
	}
}
close $fh or die "$dataOutput: $!";

#write to control file
open CONTROL_OUT, ">", "$controlOutput" or die "$controlOutput: $!";

foreach $indicatorCode (keys (%Indicators)){
	$indicatorName=$Indicators{$indicatorCode};
	$line="db.indicator.insert( { \"indicator_key\":\"$indicatorCode\","
		."\"indicator_text\":\"$indicatorName\"," 
		."\"data_source\":\"WDI\"," 
		."\"dimension\":[d_country, d_year],";
	if ($indicatorName =~ m/\%/ ){
		$line.="\"data_type\":\"percentage\"";
	}else{
		$line.="\"data_type\":\"number\"";
	}
	$line.="});\n";
	print CONTROL_OUT $line;
}
close CONTROL_OUT or die "$controlOutput: $!";

