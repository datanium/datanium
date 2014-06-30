#!D:\Perl64\bin\perl.exe
##############################################################
#This Perl is used to load formatted WDI data from WorldBank
##############################################################
use strict;
use Text::CSV;
use Getopt::Long;

# Options VAR with default value
my $opt_WDI_Data		="WDI_Data.csv";
my $opt_WDI_Country		="WDI_Country.csv";
my $opt_WDI_Series		="WDI_Series.csv";
my $opt_dataOutput		="DATA_OUTPUT.csv";
my $opt_controlOutput	="CONTROL_OUTPUT.txt";
my $opt_help;

# temp var
my $line;
my $lineNumber;
my @fields;
my $countryNameOffset;
my $countryCodeOffset;
my $indicatorNameOffset;
my $indicatorCodeOffset;
my $regionOffset;
my $topicOffset;
my $yearOffset=0;
my $offset;
my $country;
my $year;
my $indicatorCode;
my $indicatorName;
my $countryCode;
my $value;
my @row;

#data var
my %DataByCountry;
my %Indicators;
my %Regions;
my %Countries;
my %Topics;
my @years;
#my @countries;

# Get options from command line
GetOptions ("help"		=> \$opt_help,
			"data=s"	=> \$opt_WDI_Data,			# WDI_Data input file name
            "country=s"	=> \$opt_WDI_Country,		# WDI_Country input file name
            "series=s"	=> \$opt_WDI_Series,		# WDI_Series input file name
			"odata=s"	=> \$opt_dataOutput,		# Data output file name
			"ocontrol=s"=> \$opt_controlOutput)		# Control output file name
or die("Error in command line arguments\n");

sub usage()
{
	print STDERR "This Perl is used to load formatted WDI data from WorldBank
$0 [-h] -data file -country file -series file -out file -coutput file 

-help(h)          : This (help) message
-data(d)          : WDI data input file        default: WDI_Data.csv
-country(c)       : WDI country input file     default: WDI_Country.csv
-series(s)        : WDI series input file      default: WDI_Series.csv
-odata(od)        : output converted data file default: DATA_OUTPUT.csv
-ocontrol(oc)     : output control file        default: CONTROL_OUTPUT.txt
";
	exit;
}
usage if $opt_help;

#----------------WDI DATA---------------------------
#first line is header
if (!open (WDI_DATA, $opt_WDI_Data)){
	die "cannot open file $opt_WDI_Data , $!";
}
$line=<WDI_DATA>;
@fields=split(',',$line);
$offset=0;
foreach (@fields){
	if ($_ =~ m/Contry Name/){
		$countryNameOffset=$offset;
	}
	if ($_ =~ m/Country Code/){
		$countryCodeOffset=$offset;
	}
	if ($_ =~ m/Indicator Name/){
		$indicatorNameOffset=$offset;
	}
	if ($_ =~ m/Indicator Code/){
		$indicatorCodeOffset=$offset;
	}
	if ($_ =~ m/(\d{4})/ ){
		push (@years,$1);
		$yearOffset=$offset if $yearOffset eq 0;
	}
	$offset++;
}
close (WDI_DATA);

# start reading CSV
my $csv = Text::CSV->new ( { binary => 1 } )  # should set binary attribute.
	or die "Cannot use CSV: ".Text::CSV->error_diag ();
open my $fh, "<:encoding(utf8)", $opt_WDI_Data or die "$opt_WDI_Data: $!";

print "Start Loading WDI_DATA file\n";
$lineNumber=0;
while (my $fieldsInLine = $csv->getline($fh)){
	if ($lineNumber ne 0){

		$country=$fieldsInLine->[$countryNameOffset];
		$countryCode=$fieldsInLine->[$countryCodeOffset];
		$indicatorCode=$fieldsInLine->[$indicatorCodeOffset];
		$indicatorName=$fieldsInLine->[$indicatorNameOffset];
		#replace '.' with '_' as mongo db doesn't accept '.' inside keys
		$indicatorCode=~ s/\./_/g;
		
		$Indicators{$indicatorCode}=$indicatorName;
		$Countries{$countryCode}=$country;
		#push (@countries, $country) unless grep { $_ eq $country} @countries;
		
		$offset=0;
		foreach $year(@years) {
			$value=$fieldsInLine->[$yearOffset+$offset];
			if ($value =~ m/E[-+]/){
				$value=$value*1;
			}
			$DataByCountry{$countryCode}->{$year}->{$indicatorCode}=$value;
			$offset++;
		}
	}
	$lineNumber++;
}
$csv->eof or $csv->error_diag();
close $fh;

#----------------WDI COUNTRY---------------------------
if (!open (WDI_COUNTRY, $opt_WDI_Country)){
	die "cannot open file $opt_WDI_Country , $!";
}
$line=<WDI_COUNTRY>;
@fields=split(',',$line);
$offset=0;
foreach (@fields){
	if ($_ =~ m/CountryCode/){
		$countryCodeOffset=$offset;
	}
	if ($_ =~ m/Region/){
		$regionOffset=$offset;
	}
	$offset++;
}
close (WDI_COUNTRY);

open my $fh, "<", $opt_WDI_Country or die "$opt_WDI_Country: $!";
print "Start Loading WDI_COUNTRY file\n";
$lineNumber=0;
while (my $fieldsInLine = $csv->getline($fh)){
	if ($lineNumber ne 0){
	
		$countryCode=$fieldsInLine->[$countryCodeOffset];
		$Regions{$countryCode}=$fieldsInLine->[$regionOffset];
	}
	$lineNumber++;
}
$csv->eof or $csv->error_diag();
close ($fh);

#----------------WDI SERIES-----------------------------
if (!open (WDI_SERIES, $opt_WDI_Series)){
	die "cannot open file $opt_WDI_Series , $!";
}
$line=<WDI_SERIES>;
@fields=split(',',$line);
$offset=0;
foreach (@fields){
	if ($_ =~ m/SeriesCode/){
		$indicatorCodeOffset=$offset;
	}
	if ($_ =~ m/Topic/){
		$topicOffset=$offset;
	}
	$offset++;
}
close (WDI_SERIES);

open my $fh, "<", $opt_WDI_Series or die "$opt_WDI_Series: $!";
print "Start Loading WDI_SERIES file\n";
$lineNumber=0;
while (my $fieldsInLine = $csv->getline($fh)){
	if ($lineNumber ne 0){
	
		$indicatorCode=$fieldsInLine->[$indicatorCodeOffset];
		#replace '.' with '_' as mongo db doesn't accept '.' inside keys
		$indicatorCode=~ s/\./_/g;
		$Topics{$indicatorCode}=$fieldsInLine->[$topicOffset];
	}
	$lineNumber++;
}
$csv->eof or $csv->error_diag();
close ($fh);

#########write to a data file
print "Start writing WDI data to $opt_dataOutput\n";
open my $fh, ">:encoding(utf8)", "$opt_dataOutput" or die "$opt_dataOutput: $!";
$csv->eol("\n");
push (@row, "country");
push (@row, "region");
push (@row, "year");
push (@row, keys (%Indicators));
$csv->print ($fh, \@row);

foreach $countryCode (keys (%Countries)){
	foreach $year(@years){
		@row=();
		push (@row, $Countries{$countryCode});
		push (@row, $Regions{$countryCode});
		push (@row, $year);
		foreach $indicatorCode (keys (%Indicators)){
			#push (@row, $indicatorCode);
			push (@row, $DataByCountry{$countryCode}->{$year}->{$indicatorCode});
		}
		$csv->print ($fh, \@row);
	}
}
close $fh or die "$opt_dataOutput: $!";

#write to control file
print "Start writing control data to $opt_controlOutput\n";
open CONTROL_OUT, ">", "$opt_controlOutput" or die "$opt_controlOutput: $!";

print CONTROL_OUT "d_year={\"dimension_key\":\"year\", \"dimension_text\":\"Year\"};\n";
print CONTROL_OUT "d_region={\"dimension_key\":\"region\", \"dimension_text\":\"Region\"};\n"; 
print CONTROL_OUT "d_country={\"dimension_key\":\"country\", \"dimension_text\":\"Country\"};\n";

foreach $indicatorCode (keys (%Indicators)){
	$indicatorName=$Indicators{$indicatorCode};
	$line="db.indicator.insert( { \"indicator_key\":\"$indicatorCode\","
		."\"indicator_text\":\"$indicatorName\"," 
		."\"data_source\":\"WDI\"," 
		."\"dimension\":[d_year, d_region, d_country],";
	if ($indicatorName =~ m/\%/ ){
		$line.="\"data_type\":\"percentage\",";
	}else{
		$line.="\"data_type\":\"number\",";
	}
	$line.="\"topic\":\"$Topics{$indicatorCode}\"";
	$line.="});\n";
	print CONTROL_OUT $line;
}
close CONTROL_OUT or die "$opt_controlOutput: $!";
